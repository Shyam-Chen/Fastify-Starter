export default {
  title: 'Fastify Starter',
  description: 'A boilerplate for Node.js, Fastify, TypeScript, Vite, Playwright, and Render.',
  themeConfig: {
    logo: 'https://api.iconify.design/simple-icons/fastify.svg?color=%2342b883',
    nav: [
      { text: 'Guide', link: '/directory-structure/introduction' },
      // { text: 'Configs', link: '/configs' },
      // { text: 'GitHub', link: 'https://github.com/Shyam-Chen/Fastify-Starter' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Shyam-Chen/Fastify-Starter' },
      // { icon: 'twitter', link: 'https://twitter.com/intlify' },
    ],
    sidebar: [
      {
        text: 'Directory Structure',
        collapsible: true,
        items: [
          { text: 'Introduction', link: '/directory-structure/introduction' },
          { text: 'public', link: '/directory-structure/public' },
          {
            text: 'src',
            items: [
              { text: 'modules', link: '/directory-structure/modules' },
              // { text: 'plugins', link: '/directory-structure/plugins' },
            ],
          },
        ],
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} Fastify Starter`,
    },
  },
};
