module.exports = function (req, res, next) {
    const image_folder = '/images/';
    res.locals.name = req.session.username;
    res.locals.role = req.session.role;
    res.locals.title = 'AmazingWeb';
    res.locals.inits = {
        banner: [
            'Book a table for yourself at a time convenient for you',
            'Tasty & Delicious Food',
            'Welcome to WebAmazing'
        ].map((title, i) => {
            return {
                image: image_folder + 'bg_' + (parseInt(i) + 1) + '.jpg',
                title: title
            }
        }),
        menu: {
            main: [
                'Baked Lobster With A Garnish',
                'Udon Noodles With Vegetables',
                'Grilled Beef with potatoes',
                'Fruit Vanilla Ice Cream',
                'Asian Hoisin Pork',
                'Spicy Fried Rice & Bacon',
                'Mango Chili Chutney',
                'Savory Watercress Chinese Pancakes',
                'Soup With Vegetables And Meat',
            ].map((title, i) => {
                return {
                    image: image_folder + 'dish-' + (parseInt(i) + 1) + '.jpg',
                    title: title,
                    consist: ['Meat', 'Potatoes', 'Rice', 'Tomatoes'],
                    price: 29
                }
            }),
            dessert: Object.keys([...Array(10)]).map(i => {
                return {
                    image: image_folder + 'dessert-' + (parseInt(i) + 1) + '.jpg',
                    title: 'Dessert',
                    consist: ['Meat', 'Potatoes', 'Rice', 'Tomatoes'],
                    price: 29
                }
            }),
            drink: Object.keys([...Array(12)]).map(i => {
                return {
                    image: image_folder + 'drink-' + (parseInt(i) + 1) + '.jpg',
                    title: 'Drinking',
                    consist: ['Meat', 'Potatoes', 'Rice', 'Tomatoes'],
                    price: 29
                }
            }),
        },
        special: [
            'Beef Steak',
            'Beef Ribs Steak',
            'Chopsuey',
            'Roasted Chieken',
            'Beef Steak',
            'Beef Ribs Steak',
            'Chopsuey',
            'Roasted Chieken',
            'Beef Steak',
        ].map((title, i) => {
            return {
                title: title,
                intro: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts',
                image: image_folder + 'dish-' + (parseInt(i) + 1) + '.jpg',
                price: 10,
            }
        }),
        chef: [
            {
                name: 'Thomas Smith',
                position: 'Head Chef',
                image: image_folder + 'chef-1.jpg'
            }, {
                name: 'Francis Gibson',
                position: 'Assistant Chef',
                image: image_folder + 'chef-2.jpg'
            }, {
                name: 'Angelo Maestro',
                position: 'Assistant Chef',
                image: image_folder + 'chef-3.jpg'
            }
        ],
        blog: Object.keys([...Array(8)]).map(i => {
            return {
                image: image_folder + 'image_' + (parseInt(i) + 1) + '.jpg',
                link: '/blog/single',
                name: 'Admin',
                date: 'July 9, 2018',
                title: 'Even the all-powerful Pointing has no control about the blind texts',
                comment: 3
            }
        }),
        blog_comment: [
            {
                image: image_folder + 'person_' + Math.ceil(Math.random() * 4) + '.jpg',
                name: 'Jean Doe',
                date: 'June 27, 2018 at 2:21pm',
                content: 'Bula Bula Bula ...',
                reply: []
            },
            {
                image: image_folder + 'person_' + Math.ceil(Math.random() * 4) + '.jpg',
                name: 'Jean Doe',
                date: 'June 27, 2018 at 2:21pm',
                content: 'Bula Bula Bula ...',
                reply: [
                    {
                        image: image_folder + 'person_' + Math.ceil(Math.random() * 4) + '.jpg',
                        name: 'Jean Doe',
                        date: 'June 27, 2018 at 2:21pm',
                        content: 'Bula Bula Bula ...',
                        reply: [
                            {
                                image: image_folder + 'person_' + Math.ceil(Math.random() * 4) + '.jpg',
                                name: 'Jean Doe',
                                date: 'June 27, 2018 at 2:21pm',
                                content: 'Bula Bula Bula ...',
                                reply: []
                            }
                        ]
                    },
                    {
                        image: image_folder + 'person_' + Math.ceil(Math.random() * 4) + '.jpg',
                        name: 'Jean Doe',
                        date: 'June 27, 2018 at 2:21pm',
                        content: 'Bula Bula Bula ...',
                        reply: []
                    }
                ]
            },
        ],
        review: Object.keys([...Array(4)]).map(i => {
            return {
                name: 'Dennis Green',
                from: 'Guests from Italy',
                image: image_folder + 'person_' + (parseInt(i) + 1) + '.jpg',
                rate: 4.5,
                content: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
            }
        }),
        social: Object.keys([...Array(5)]).map(i => image_folder + 'insta-' + (parseInt(i) + 1) + '.jpg'),
    };
    next();
};