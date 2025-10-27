import { Card, CardContent } from "./ui/card";
import { Quote } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { fetchTestimonials, Testimonial } from "@/lib/api";

const Testimonials = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBatch, setCurrentBatch] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchTestimonials();
        if (mounted) setItems(data);
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (items.length > 3) {
      intervalRef.current = window.setInterval(() => {
        setCurrentBatch((prevBatch) => (prevBatch + 1) % Math.ceil(items.length / 3));
      }, 5000);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [items]);

  const getBatchItems = () => {
    const startIndex = currentBatch * 3;
    return items.slice(startIndex, startIndex + 3);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What <span className="text-accent">Players Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our amazing players about their CPL experience
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {loading ? (
            <Card className="border-border animate-pulse">
              <CardContent className="p-8">
                <div className="h-40 bg-muted rounded" />
              </CardContent>
            </Card>
          ) : items.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center">No testimonials yet.</CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in">
              {getBatchItems().map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="border-border shadow-glow transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-accent/10"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {testimonial.avatar_url ? (
                        <img
                          src={testimonial.avatar_url}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                          {testimonial.name
                            .split(" ")
                            .map((s) => s[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <blockquote className="text-muted-foreground italic mt-4">"{testimonial.message}"</blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
