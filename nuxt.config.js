export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Vidrl',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'author', content: 'Vidrl' },
      { name: 'theme-color', content: '#7733f4' },
      { name: 'description', content: '' },
      { name: 'keywords', content: '' },

      // Schema.org markup for Google+
      { itemprop: 'name', content: 'Vidrl' },
      { itemprop: 'description', content: 'Create video event online' },
      {
        itemprop: 'image',
        content:
          'https://res.cloudinary.com/da8zzhkwy/image/upload/v1588800785/seo/seo-card_ekliop.png'
      },

      // Twitter Card data
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@vidrl' },
      { name: 'twitter:title', content: 'Vidrl' },
      { name: 'twitter:url', content: 'https://vidrl.netlify.app' },
      {
        name: 'twitter:image',
        content:
          'https://res.cloudinary.com/da8zzhkwy/image/upload/v1588800785/seo/seo-card_ekliop.png'
      },
      { name: 'twitter:description', content: 'Text here' },
      { name: 'twitter:app:country', content: 'NG' },
      { name: 'twitter:creator', content: '@vidrl' },
      { name: 'twitter:domain', content: '@vidrl' },
      // Twitter summary card with large image must be at least 280x150px
      {
        name: 'twitter:image:src',
        content:
          'https://res.cloudinary.com/da8zzhkwy/image/upload/v1588800785/seo/seo-card_ekliop.png'
      },

      // Open Graph data
      { property: 'og:title', content: 'Vidrl' },
      { property: 'og:url', content: 'https://vidrl.netlify.app' },
      {
        property: 'og:image',
        content:
          'https://res.cloudinary.com/da8zzhkwy/image/upload/v1588800785/seo/seo-card_ekliop.png'
      },
      {
        property: 'og:description',
        content: 'Create video based event in minutes'
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Vidrl' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: 'https://js.hs-scripts.com/7636004.js',
        defer: true,
        type: 'text/javascript'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#7733f4' },
  /*
   ** Global CSS
   */
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/vid-variables.scss',
    '@/assets/css/vid-icons.css',
    '@/assets/css/vid-ds.scss',
    '@/assets/css/vid-main.scss',
    '@/assets/css/vid-media.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/element-ui', '@/plugins/directives'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  generate: {
    fallback: true
  }
}
