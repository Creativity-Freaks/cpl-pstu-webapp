import { Card, CardContent } from "./ui/card";

const Sponsors = () => {
  const sponsors = [
    { name: "CF Tech", logo: "/src/assets/sponsors/cftech.png" },
    { name: "CPL 2026", logo: "/src/assets/sponsors/cpl2026.jpg" },
    { name: "Nobarun", logo: "/src/assets/sponsors/favicon.jpg" },
    { name: "CF Tech", logo: "/src/assets/sponsors/cftech.png" },
    { name: "CPL 2026", logo: "/src/assets/sponsors/cpl2026.jpg" },
    { name: "Nobarun", logo: "/src/assets/sponsors/favicon.jpg" },

  ];

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Our <span className="text-accent">Sponsors</span>
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Proud to partner with leading organizations supporting university sports
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {sponsors.map((sponsor, index) => (
            <Card
              key={index}
              className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 hover:bg-background/20 transition-all duration-300 hover:-translate-y-2 animate-scale-in relative"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center space-y-2 h-32">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="w-20 h-20 rounded-lg object-cover shadow-accent"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity duration-300">
                  {sponsor.name}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-primary-foreground/70 text-sm">
            Interested in sponsoring CPL 2026? <a href="/contact" className="text-accent hover:underline font-medium">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
