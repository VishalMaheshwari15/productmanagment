Product Management System Hey There! Let’s Talk About My Project Yo! I’m Vishal Rathi, and I built this Product Management System to make managing products a breeze. You can add, view, update, or delete stuff like categories, colors, sizes, materials, and products—super easy! I put together a slick frontend with React and a rock-solid backend using Node.js, Express, and Sequelize (hooked up to MySQL with XAMPP). It’s got cool features like dark mode/light mode, pagination to browse products, and a notification bar that pops up with messages like “Product added successfully!” My goal was to create something clean, user-friendly, and crazy functional.

What I Wanted to Build Here’s what I was aiming for with this project: Handle Categories, Colors, Sizes, and Materials

You can add, view, update, or delete categories, colors, sizes, and materials. Each one needs a name—no skipping that! For colors, you can add a hex code (like #ff5733) if you want, but it’s optional. Everything gets saved in a MySQL database (set up with XAMPP).

Work with Products

Add, view, update, or delete products, no problem. Every product needs a name, price, quantity, and a category. You can also toss in a description, color, size, or material, but those are optional. Products are linked to categories, colors, sizes, and materials, so it all ties together.

View and Filter Products

You’ll see a list of products with details like name, price, quantity, category, color, size, material, and description. If there’s nothing to show, it says “No products found.” Filter products by category, color, size, material, price range, or quantity range. Sort them by name, price, or quantity (ascending or descending). Added pagination—5 products per page with Previous/Next buttons to flip through.

Make It Look Good

Wanted it to look sharp and work great on phones and laptops. Used Tailwind CSS to style everything—it’s awesome for making things look nice! Added dark mode and light mode with a toggle button. Separate pages for managing categories, colors, sizes, materials, and products. Tables for lists and pop-up modals for adding or updating stuff. There’s a “Reset Filters” button on the products page to clear all filters.

Show Notifications

Built a notification bar that pops up after you do something. Shows stuff like “Product added successfully!” in green for good vibes. If something’s wrong, like missing a field, it flashes a red error like “Name is required.”

Set Up the Backend

Used a MySQL database (via XAMPP) to store all the data. Made APIs for adding, viewing, updating, and deleting categories, colors, sizes, materials, and products. Products are connected to categories, colors, sizes, and materials, so it all works smoothly.

Catch Mistakes

I check for required fields (like name or price) and show errors if you miss them. The notification bar tells you what’s wrong, like “Price is required,” so you can fix it fast.

Frontend (The Part You See) I built the frontend with React to make it smooth and interactive. Here’s what I put together: Files I Made

src/App.jsx: The main file that sets up the app—navigation bar, routing, and the dark/light mode toggle. You can jump between pages easily. src/pages/ManageCategories.jsx: Lets you manage categories (add, view, update, delete). Shows a table of categories and uses modals for adding/updating. Notifications pop up after actions, like “Category added!” src/pages/ManageColors.jsx: Handles colors (add, view, update, delete). You can add a hex code if you want. Notifications show up, like “Color updated successfully!” src/pages/ManageSizes.jsx: For sizes (add, view, update, delete). Same deal with notifications. src/pages/ManageMaterials.jsx: For materials (add, view, update, delete). Notifications included. src/pages/ProductManagement.jsx: The big one for products! Has buttons for “Add Product,” “Filter Products,” and “Reset Filters.” Shows the product list and opens modals for adding/filtering. src/components/ProductList.jsx: Shows all products in a grid with details (name, price, quantity, etc.). Each product has “Update” and “Delete” buttons. Pagination here—5 products per page with Previous/Next. Notifications pop up, like “Product deleted successfully!” src/components/ProductForm.jsx: The form for adding or updating products. Has fields for name, price, quantity, description, category, color, size, and material. Checks required fields and shows notifications, like “Product added successfully!” or “Price is required.” src/components/Filters.jsx: The filter form for products. Has dropdowns for category, color, size, and material, plus inputs for min/max price and quantity. You can sort by name, price, or quantity (up or down). src/components/NotificationSidebar.jsx: The notification bar I made! Pops up on the side with messages—green for success (like “Category added!”) and red for errors (like “Something went wrong!”). You can close it with an “x” button.

Stuff I Installed for the Frontend I used npm to install these 7 packages:

react: The main tool for building the UI. react-dom: Gets React working in the browser. react-router-dom: Lets you switch between pages. axios: Makes it easy to talk to the backend (like fetching products). tailwindcss: My go-to for styling—makes everything look clean and responsive. @tailwindcss/vite: A plugin so Tailwind works with Vite. vite: The tool I used to run and build the app.

How the Frontend Works When you open the app, there’s a navigation bar to jump between Categories, Colors, Sizes, Materials, and Products. There’s a button to toggle dark/light mode—super handy! Each page (like Categories) shows a table with items, and you can add, update, or delete stuff using modals. After you do something, the notification bar pops up to tell you if it worked or if there’s an issue. On the Products page, you can add products, filter them, and browse with pagination. Tailwind CSS makes it look good, switching styles for dark mode (like dark:bg-gray-800) and light mode (like bg-white).

Backend (The Part That Handles Data) The backend is what stores and manages all the data. I built it with Node.js, Express, and Sequelize, talking to a MySQL database (set up with XAMPP). Files I Made

models/: Includes Category.js, Color.js, Size.js, Material.js, and Product.js to set up database tables and how they’re connected. There’s also an index.js to hook Sequelize up to MySQL. controllers/: Has categoryController.js, colorController.js, sizeController.js, materialController.js, and productController.js. These handle the logic for adding, viewing, updating, and deleting stuff. The product controller makes sure products link to categories, colors, sizes, and materials. routes/: Includes categoryRoutes.js, colorRoutes.js, sizeRoutes.js, materialRoutes.js, and productRoutes.js. These set up the API endpoints, like GET /api/categories to get all categories, POST /api/products to add a product, PUT /api/colors/:id to update a color, or DELETE /api/sizes/:id to delete a size.

Stuff I Installed for the Backend I used npm to install these 4 packages:

express: The tool for making APIs. sequelize: Helps manage the MySQL database. mysql2: Lets Sequelize talk to MySQL. dotenv: Loads database settings (like username and password) from a file.

How the Backend Works The backend runs a server with Express that listens for requests from the frontend. Sequelize manages the MySQL database, with tables for categories, colors, sizes, materials, and products. Products are linked to the other stuff—like a product belongs to a category and might have a color, size, or material. The backend provides APIs to add, view, update, or delete anything. When you do something (like add a product), the backend sends a message back, and the frontend shows it in the notification bar.

All the Stuff I Installed

Frontend: 7 packages (react, react-dom, react-router-dom, axios, tailwindcss, @tailwindcss/vite, vite). Backend: 4 packages (express, sequelize, mysql2, dotenv). Total: 11 packages.

How to Get It Running Here’s how to fire up my project—it’s pretty straightforward!

Set Up the Database (MySQL with XAMPP):

Install XAMPP and start Apache and MySQL. Go to phpMyAdmin (http://localhost/phpmyadmin) and create a database called product_management. In the backend/ folder, open the .env file and add your MySQL details like this:DB_HOST=localhost DB_USER=root DB_PASSWORD= DB_NAME=product_management

(XAMPP usually uses root for the username and no password, unless you changed it.)

Run the Backend:

Open a terminal in the backend/ folder. Run npm install to grab all the backend packages. Run node server.js to start the backend—it’ll be on http://localhost:5000. Sequelize will set up the database tables for you.

Run the Frontend:

Open another terminal in the project root folder. Run npm install to get the frontend packages. Run npm run dev to start the frontend—it’ll be on http://localhost:3000.

Check It Out:

Open your browser and go to http://localhost:3000. You’ll see a navigation menu to jump between pages: /categories: Manage categories. /colors: Manage colors. /sizes: Manage sizes. /materials: Manage materials. /admin/products: Manage products.

Try the dark/light mode toggle in the nav bar—it’s pretty dope! When you add, update, or delete stuff, the notification bar will let you know what’s up.

What I Got Done

Full Management: Add, view, update, or delete categories, colors, sizes, materials, and products. MySQL Database: Set up with XAMPP to store everything. Connections: Products are linked to categories, colors, sizes, and materials. Dark/Light Mode: Toggle between themes, looks great in both! Pagination: Product list shows 5 per page with Previous/Next buttons. Notification Bar: Pops up to tell you what’s happening, like “Product added!” or “Something went wrong!” Nice Design: Tailwind CSS makes it clean and works on mobile or desktop. Filtering/Sorting: Filter products by category, color, size, material, price, or quantity, and sort however you want.

How I’d Explain It to Someone The Frontend Part “I built the frontend with React—it’s what you see and click on. There are pages for categories, colors, sizes, materials, and products, each with a table to show stuff and pop-up forms to add or edit things. A notification bar pops up after you do something, like ‘Product added!’ in green. The products page lets you filter, sort, and browse with pagination (5 products at a time). I added a dark/light mode toggle in the nav bar. Used 7 packages, like React for the UI, Axios to talk to the backend, and Tailwind CSS to make it look slick.” The Backend Part “The backend’s built with Node.js, Express, and Sequelize—it handles all the data. I set up a MySQL database with XAMPP to store everything. There are APIs for adding, viewing, updating, and deleting categories, colors, sizes, materials, and products. Products are linked to the other stuff, so you can see their category, color, size, or material. When you do something, the backend sends a message, and the frontend shows it in the notification bar. Used 4 packages, like Express for APIs and Sequelize for the database.”

Things I Could Add Later

Product Images: Add a way to upload and show images for products—that’d be cool! Login System: Maybe add a login so only admins can make changes. Bulk Actions: Let you delete or manage multiple things at once. Fancier UI: Could show a preview of color hex codes on the Colors page. More Filters: Add a search by product name to make finding stuff easier.

Made by: Vishal Rathi Date: May 11, 2025
