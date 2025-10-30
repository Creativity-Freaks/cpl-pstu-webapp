-- Migration to insert predefined teams into the `teams` table

insert into teams (
   key,
   name,
   short,
   description
) values ( 'csit',
           'Computer Science & Information Technology',
           'CSIT',
           'Tech-driven cricketing excellence. Where data meets discipline and passion.' ),( 'cce',
                                                                                             'Computer & Communication Engineering'
                                                                                             ,
                                                                                             'CCE',
                                                                                             'Communication, coordination, and classy stroke play.'
                                                                                             ),( 'pme',
                                                                                                                                                    'Power & Mechanical Engineering'
                                                                                                                                                    ,
                                                                                                                                                    'PME'
                                                                                                                                                    ,
                                                                                                                                                    'Power hitters with precision mechanics on the field.'
                                                                                                                                                    )
                                                                                                                                                    ,
                                                                                                                                                    (
                                                                                                                                                    'eee'
                                                                                                                                                    ,
                                                                                                                                                                                                           'Electrical & Electronic Engineering'
                                                                                                                                                                                                           ,
                                                                                                                                                                                                           'EEE'
                                                                                                                                                                                                           ,
                                                                                                                                                                                                           'Electrifying pace, charged fielding, and smart tactics.'
                                                                                                                                                                                                           )
                                                                                                                                                                                                           ,
                                                                                                                                                                                                           (
                                                                                                                                                                                                           'mathematics'
                                                                                                                                                                                                           ,
                                                                                                                                                                                                                                                                     'Mathematics'
                                                                                                                                                                                                                                                                     ,
                                                                                                                                                                                                                                                                     'Mathematics'
                                                                                                                                                                                                                                                                     ,
                                                                                                                                                                                                                                                                     'Calculated shots, perfect angles, and strategic gameplay.'
                                                                                                                                                                                                                                                                     )
                                                                                                                                                                                                                                                                     ;