# cmpe280-amazingweb

## Mongodb
+ For debug only, list all users
    ```
    $ brew install mongodb
    $ mongo mongodb+srv://test:1234@cluster0-friod.mongodb.net/test
    $ use test
    $ db.user.find({},{_id:0,username:1,password:1,role:1})
    ```

## How to Run
1. Install tools (Require **node**)
    ```
    $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    $ brew install node
    ```
2. Go to the project root folder, install **dependencies**, run app.js and visit [localhost](http://127.0.0.1:8080) in the default browser.
    ```
    $ npm install
    $ node app.js
    ```
3. Please notice that this project used an online mongodb database, so it requires network.
4. Please use [admin 1234] to login to view the dashboard.
5. If you want to change the server port, please go to config.json in the root folder and change the value of "http" -> "port"

## Our work
1. We used an free CSS/HTML template to build a restaurant reservation website. The template comes from [Colorlib](https://colorlib.com/)
2. Structure:
    + /layout
        - basic layer pages to define the layout
    + /partials
        - head.jade -> css files
        - header.jade -> navigation bar
        - scripts.jade -> javascript files
        - footer.jade -> basic website info
        - sidebar.jade -> sub navigation at manage page
    + /page_partials
        - page components like banner, menu, social links ...
    + main public pages
3. Prototype functionalities:
    + Login／Logout／Sign up
    + Reservation
    + Hovering animation (logo.js/ball.js/cube.js)
    + Droppable/Sortable menu cart
    + Ajax tab blog
    + Mongodb utility
    + For Administrator
        - username: admin
        - password: 1234
        - Manage all users
        - View data charts through dashboard