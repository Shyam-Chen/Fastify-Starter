import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Fastify Starter',
  description: 'A boilerplate for Node.js, Fastify, TypeScript, Vite, Playwright, and Render.',
  lang: 'en-US',
  themeConfig: {
    logo: 'https://api.iconify.design/simple-icons/fastify.svg?color=%2342b883',
    nav: [
      { text: 'Guide', link: '/guide/project-setup/introduction' },
      { text: 'Modules', link: '/modules/todos' },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/Shyam-Chen/Fastify-Starter' }],
    sidebar: {
      '/guide': [
        {
          text: 'Project Setup',
          collapsed: false,
          items: [{ text: 'Introduction', link: '/guide/project-setup/introduction' }],
        },
        {
          text: 'Directory Structure',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/guide/directory-structure/introduction' },
            { text: 'public', link: '/guide/directory-structure/public' },
            {
              text: 'src',
              items: [
                { text: 'modules', link: '/guide/directory-structure/modules' },
                { text: 'templates', link: '/guide/directory-structure/templates' },
                // { text: 'plugins', link: '/directory-structure/plugins' },
              ],
            },
            { text: 'gitignore', link: '/guide/directory-structure/gitignore' },
          ],
        },
      ],
      '/modules': [
        {
          text: 'Authentication',
          collapsed: false,
          items: [
            { text: 'Sign up', link: '/modules/auth/sign-up' },
            { text: 'Sign in', link: '/modules/auth/sign-in' },
            { text: 'Profile', link: '/modules/auth/profile' },
          ],
        },
        {
          text: 'XXX',
          collapsed: false,
          items: [
            { text: 'Todos', link: '/modules/todos' },
            { text: 'Foo', link: '/modules/xxx/foo' },
            { text: 'Bar', link: '/modules/xxx/bar' },
          ],
        },
        {
          text: 'Loan Charges',
          collapsed: false,
          items: [
            { text: 'One-time', link: '/modules/loan-charges/one-time' },
            { text: 'Amortize', link: '/modules/loan-charges/amortize' },
            { text: 'Advance', link: '/modules/loan-charges/advance' },
          ],
        },
      ],
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} Fastify Starter`,
    },
  },
});
