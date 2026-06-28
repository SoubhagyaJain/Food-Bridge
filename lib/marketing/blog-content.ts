export type BlogCategory =
  | "Impact Stories"
  | "Practical Guides"
  | "Volunteer Voices"
  | "Anna Daata";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  image: string;
  author: string;
  readTime: string;
  featured?: boolean;
};

export const BLOG_CATEGORIES = [
  "All Stories",
  "Impact Stories",
  "Practical Guides",
  "Volunteer Voices",
] as const;

export type BlogCategoryFilter = (typeof BLOG_CATEGORIES)[number];

export const FEATURED_POST: BlogPost = {
  id: "featured-diwali",
  slug: "diwali-mithaiyan-meena",
  title: "Diwali ki Mithaiyan Jo Meena ke Ghar Tak Pahunchi",
  excerpt:
    "The lights were still glowing outside when Meenakshi stood in her kitchen staring at three big trays of leftover mithai. How surplus from one family's celebration in Bhopal reached children in a nearby mohalla, bringing the true light of Diwali to those who needed it most.",
  category: "Impact Stories",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBMAi8-9qYFgsKNXZFfQwuruHzbV8OqhJxgbglMgtF3PQ_dhz8D_evBjxSu3VxspHnw90CLvQ7_YYDgZPrZMcuI6lCLRrBR09VsQPo7F0zA9FDnkjiAR5ze-zAwY_YMDkFyQ7P00pTlgl7nBWzvRGoagCg480oyqHrKBtZ-Z_Lz5y-nx0qqPFmsfhTIuIHWvPt5e_70m-gmVyyHsv7tyEc8jckatq-deP98YPgHluMQWRX_jI-u-nqiXrK64TcAJM5zQin_u7RusLM0UIc",
  author: "Meenakshi S.",
  readTime: "6 min read",
  featured: true,
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "shaadi-khana",
    slug: "shaadi-ke-baad-ka-khana",
    title: "Ek Shaadi ke Baad Ka Khana: Feeding 80 Families",
    excerpt:
      "A 'Big Fat Indian Wedding' in Indore had surplus that usually goes to waste. See how Foodbridge redirected it to those in need.",
    category: "Impact Stories",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_4jrILOannGhjEDNiKzhmrrS3-mzTHfd8wgo-H2-M74qqg5ojh7GJstq8Do2ZYAXmokCEs3vBDy49E8a_fPXg1rb32o_AqKGpdxnbZyjHP7b3ypG-cVzMsgFjm--JNSBRwqi6pY8Bf4f_O7DeRJe04mcgO6ztQswnjGLPQSZP3pSZkD6ul0xKB-qRfPtu-ZhAOpoSWDdcm4iyYNshkoRP-t7peUCx-miJ4k6zYJNzV3R3PtLAyDOl99jgavp2YMXuhM-avEKE_w843EQ",
    author: "Indore Team",
    readTime: "5 min read",
  },
  {
    id: "kitchen-tips",
    slug: "indian-kitchen-waste-tips",
    title: "5 Simple Changes for Indian Kitchens",
    excerpt:
      "From storing rotis traditionally to repurposing leftover dal—cut waste by 40% with these mohalla-tested tips.",
    category: "Practical Guides",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA4LWwJG8-qCL1bjxDNc_f-2rAqNn4OoPmLaxxVzx7aP8LXxTkwMenVgeKOnKJJuo7MUravmnbV8LOpgrXsuRmylY3eIICMcxro1YVI_Pj4GwmheTUIRIHEA_sxDY3L7bzmXz5c-unZstfkf4rsrys2VzX7UPvnZWMOsn-3t4LUm4Oo73h4GpCN0kH8rxZYfToIigAz_YPodoaikXbXLnyo9RJ4YSa8QopPtfZ-2DpJGsqB2IMwjLt2BSjc9aL9gRfW9y88GWRj5Tep",
    author: "Foodbridge Team",
    readTime: "4 min read",
  },
  {
    id: "temple-prasad",
    slug: "prasad-jo-barbad-nahi-hua",
    title: "Prasad Jo Barbad Nahi Hua: A Temple's Story",
    excerpt:
      "How a local temple trust partnered with volunteers to ensure every grain of prasad reaches the hungry.",
    category: "Volunteer Voices",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEPbVH6Y-Rg3uRD5Jqpwc8P_z23MGXulHR4xboOoaG4VrHp8Rq-PznzXBYiyB6pTDANj2AHB3BtIwu1qtGc-PHnqpfF35QzDZ6GTgv8SG-PgTzx1-dCUnnO9KP9dgfvpWpQSgADJMGib0mEMFCprJd9ncdI4d1jPSfGxkuCwU5sCkY9e_jLW36Mu1OJPZI6Ooz3yq9iHZYZmg95xapZRB86nk7u3ZXiqXOYpXGXFDS8MPcKtNOq7avqdASaasEFEIlJVGcz_D0K0gL58s",
    author: "Rahul K.",
    readTime: "6 min read",
  },
  {
    id: "wedding-waste",
    slug: "waste-in-indian-weddings",
    title: "The Hidden Truth of Waste in Indian Weddings",
    excerpt:
      "A deep dive into the cultural excess of our festivals and how we can return to the values of mindful sharing.",
    category: "Anna Daata",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjW-LCbhdYGI-NEAWLOsmkFIc1ybygN2pZGUKZ-BsBbrBR5v-AyGWWDcSTJj_wyNzy5uj6m5-lRmjp3Hjlv9sffQQtw6VIhSlX0kxwqzTGAbBaNa5V42cM7Xpvl4yUgUqATLQd5H4NQVEvflM9GqhMlAgcx2l37Lh2j_hpSFwg65dt0d3onlo2C1diw6GR8cb3nJlBQpyVKWoRrH69F_rvWDxwpNin0pk8EaBHCEYaathx7hR0_wombFc34z6c25ZAZQkZVW_jUGYxcXc",
    author: "Editorial Team",
    readTime: "10 min read",
  },
];

export const MOST_READ = [
  { rank: 1, title: "5 Ways to Reduce Waste at Home", category: "Practical Guides" as const },
  { rank: 2, title: "Meet the Volunteers: Sarah's Story", category: "Volunteer Voices" as const },
  { rank: 3, title: "Prasad Jo Barbad Nahi Hua", category: "Impact Stories" as const },
];

export const FEATURED_AUTHOR_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAQa_FloEat-32tuV2HCj-3oDjKl3Byf1j6kLC54vr0EP4g5OzCV4Q6K4K19cBTSEdf3FZANwrUdnSkW-VCV-SaT9QHsyKQ6fLb-SCxCmU1PcdPsqA7soEfbz4c_aPIV9TJqkzYdj2qYVNUTCaJWzZGYDL-00bNz3KUt8BwM5kqjGpDJmZmzjxgRESjw3EtHVt1lM7Ti2YhqvILm7ZcII891Pnj1kZHL6MWv1vhEe5_d-FX50vbY80dNSWwgUIvAFWzTsbUyympIzz2";