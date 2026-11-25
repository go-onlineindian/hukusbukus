const commons = (file) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(' ', '_'))}`;
const shareAlike = 'https://creativecommons.org/licenses/by-sa/4.0/';
const publicDomain = 'https://creativecommons.org/publicdomain/zero/1.0/';

export const photos = {
  gulmarg: ['Gulmarg meadows', 'Mr. Debapriya Hore', commons('Lush green meadows of Gulmarg, J&K, India.jpg'), 'CC0', publicDomain],
  strawberry: ['Strawberry Valley', 'Basharat Shah', 'https://www.flickr.com/photos/shahbasharat/2776519440/', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/'],
  drung: ['Drung Waterfall', 'Holidify photo gallery', 'https://www.holidify.com/places/gulmarg/photos.html'],
  gurez: ['Gurez Valley', 'Journo Mohsin', commons('Gurez Valley 04.jpg'), 'CC BY-SA 4.0', shareAlike],
  kishanganga: ['Kishanganga in Gurez', 'Journo Mohsin', commons('Gurez Valley 09.jpg'), 'CC BY-SA 4.0', shareAlike],
  lolab: ['Lolab Valley', 'Eshankaul007', commons('Lolab Valley-Kupwara.JPG'), 'CC BY-SA 4.0', shareAlike],
  bangus: ['Bangus Valley', 'Idrees Lone 05', commons('Bangus Valley Kashmir.jpg'), 'CC BY-SA 4.0', shareAlike],
  harwan: ['Harwan Garden', 'Japleenpasricha', commons('Harwan Garden.jpg'), 'CC BY-SA 4.0', shareAlike],
  burzahom: ['Burzahom earthenware', 'Ismoon', commons('Black earthenware. Pré-Indus civilization. Kashmir.JPG'), 'CC0', publicDomain],
  shalimar: ['Shalimar Bagh', 'Ansar Ahmad', commons('Shalimar Bagh 1.jpg'), 'CC BY-SA 4.0', shareAlike],
  ganderbal: ['Kheer Bhawani', 'Shivansh.ganjoo', commons('DBSQN5qUQAAD_zY.jpg'), 'CC BY-SA 4.0', shareAlike],
};

export const places = [
  {
    name: 'Gulmarg', area: 'Baramulla', photo: 'gulmarg', near: 'Strawberry Valley · Drung Waterfall',
    description: 'Start in Gulmarg’s open meadows, then explore a quieter valley and a waterfall near Tangmarg.',
    stops: [
      { name: 'Strawberry Valley', photo: 'strawberry', description: 'A meadow ringed by pines near Gulmarg. Look for wildflowers and notice how the landscape changes with the seasons.', map: 'Strawberry Valley Gulmarg Kashmir' },
      { name: 'Drung Waterfall', photo: 'drung', description: 'A waterfall near Tangmarg that can form curtains of ice in winter. Watch from a safe spot and check conditions before visiting.', map: 'Drung Waterfall Tangmarg Kashmir' },
    ],
  },
  {
    name: 'Gurez Valley', area: 'Bandipora', photo: 'gurez', near: 'Kishanganga River',
    description: 'Mountain slopes and riverside villages make up this valley in northern Kashmir. The Kishanganga flows through it.',
    stops: [{ name: 'Kishanganga River', photo: 'kishanganga', description: 'Look for the bends of the Kishanganga near Dawar and the mountains rising over the valley. Keep back from the river’s edge.', map: 'Kishanganga River Dawar Gurez Kashmir' }],
  },
  {
    name: 'Lolab Valley', area: 'Kupwara', photo: 'lolab', near: 'Fields, orchards & villages',
    description: 'This green valley in Kupwara is a good place to notice how farmland, orchards, and forests meet.',
    stops: [{ name: 'Sogam and the Lolab countryside', photo: 'lolab', description: 'Look for village paths, orchards, and cultivated fields nestled under the wooded slopes.', map: 'Lolab Valley Sogam Kupwara' }],
  },
  {
    name: 'Bangus Valley', area: 'Kupwara', photo: 'bangus', near: 'Bungus meadows',
    description: 'A high landscape of open meadows and surrounding woodland, also spelled Bungus.',
    stops: [{ name: 'Bangus meadows', photo: 'bangus', description: 'Look for streams and broad, grassy slopes. Ask a trusted adult to check local access and weather before setting out.', map: 'Bangus Valley Kupwara Kashmir' }],
  },
  {
    name: 'Harwan', area: 'Srinagar foothills', photo: 'harwan', near: 'Harwan Garden',
    description: 'A green corner at the foot of the mountains, not far from Dachigam National Park.',
    stops: [{ name: 'Harwan Garden', photo: 'harwan', description: 'Follow the garden paths past flowerbeds and trees. Can you spot the mountains beyond the garden?', map: 'Harwan Garden Srinagar' }],
  },
  {
    name: 'Burzahom', area: 'Near Srinagar', photo: 'burzahom', near: 'Burzahom archaeological site',
    description: 'An ancient settlement that offers clues to early life in Kashmir.',
    stops: [{ name: 'Burzahom archaeological site', photo: 'burzahom', contain: true, description: 'The site is known for pit dwellings and archaeological finds. The photograph shows an earthenware vessel from Burzahom now in the National Museum, New Delhi.', map: 'Burzahom archaeological site Srinagar' }],
  },
  {
    name: 'Shalimar', area: 'By Dal Lake', photo: 'shalimar', near: 'Shalimar Bagh',
    description: 'A Mughal garden near Dal Lake, with terraces, water channels, and chinar trees.',
    stops: [{ name: 'Shalimar Bagh', photo: 'shalimar', description: 'Follow the central water channel through the garden and look for how the pavilions frame the view.', map: 'Shalimar Bagh Srinagar' }],
  },
  {
    name: 'Ganderbal', area: 'Sind Valley', photo: 'ganderbal', near: 'Tulmulla · Kheer Bhawani',
    description: 'Explore beyond Srinagar and learn about a place of worship in Tulmulla village.',
    stops: [{ name: 'Kheer Bhawani, Tulmulla', photo: 'ganderbal', description: 'The temple sits around a sacred spring. Follow local guidance and respect worshippers and photography rules.', map: 'Kheer Bhawani Temple Tulmulla Ganderbal' }],
  },
];
