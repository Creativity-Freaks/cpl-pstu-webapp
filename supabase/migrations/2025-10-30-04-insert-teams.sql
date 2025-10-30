-- Insert data into the modified `teams` table

insert into public.teams (
   name,
   short_name,
   color,
   logo_url,
   description
) values ( 'Computer Science & Information Technology',
           'CSIT',
           '#FF5733',
           'https://example.com/csit-logo.png',
           'Tech-driven cricketing excellence. Where data meets discipline and passion.' ),( 'Computer & Communication Engineering'
           ,
                                                                                             'CCE',
                                                                                             '#33FF57',
                                                                                             'https://example.com/cce-logo.png'
                                                                                             ,
                                                                                             'Communication, coordination, and classy stroke play.'
                                                                                             ),( 'Power & Mechanical Engineering'
                                                                                             ,
                                                                                                                                                    'PME'
                                                                                                                                                    ,
                                                                                                                                                    '#3357FF'
                                                                                                                                                    ,
                                                                                                                                                    'https://example.com/pme-logo.png'
                                                                                                                                                    ,
                                                                                                                                                    'Power hitters with precision mechanics on the field.'
                                                                                                                                                    )
                                                                                                                                                    ,
                                                                                                                                                    (
                                                                                                                                                    'Electrical & Electronic Engineering'
                                                                                                                                                    ,
                                                                                                                                                                                                           'EEE'
                                                                                                                                                                                                           ,
                                                                                                                                                                                                           '#FF33A1'
                                                                                                                                                                                                           ,
                                                                                                                                                                                                           'https://example.com/eee-logo.png'
                                                                                                                                                                                                           ,
                                                                                                                                                                                                           'Electrifying pace, charged fielding, and smart tactics.'
                                                                                                                                                                                                           )
                                                                                                                                                                                                           ,
                                                                                                                                                                                                           (
                                                                                                                                                                                                           'Mathematics'
                                                                                                                                                                                                           ,
                                                                                                                                                                                                                                                                     'Mathematics'
                                                                                                                                                                                                                                                                     ,
                                                                                                                                                                                                                                                                     '#A133FF'
                                                                                                                                                                                                                                                                     ,
                                                                                                                                                                                                                                                                     'https://example.com/mathematics-logo.png'
                                                                                                                                                                                                                                                                     ,
                                                                                                                                                                                                                                                                     'Calculated shots, perfect angles, and strategic gameplay.'
                                                                                                                                                                                                                                                                     )
                                                                                                                                                                                                                                                                     ;