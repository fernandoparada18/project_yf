const fs = require('fs');

const files = [
  './src/components/ecommerce/RecentOrders.vue',
  './src/components/layout/header/NotificationMenu.vue',
  './src/components/layout/header/UserMenu.vue',
  './src/components/tables/basic-tables/BasicTableOne.vue',
  './src/components/ui/images/ThreeColumnImageGrid.vue',
  './src/views/UiElements/Avatars.vue'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Revert import.meta.env.BASE_URL back to direct strings with /project_yf
    content = content.replace(/import\.meta\.env\.BASE_URL \+ 'images\//g, "'/project_yf/images/");
    fs.writeFileSync(file, content);
    console.log('Fixed JS strings in ' + file);
  }
});
