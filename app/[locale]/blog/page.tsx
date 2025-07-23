import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import BlogHeaderWrapper from '@/components/BlogHeaderWrapper';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  author?: string;
  tags?: string[];
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
}

function extractExcerpt(content: string, length: number = 150): string {
  const plainText = content.replace(/[#*`]/g, '').replace(/\n/g, ' ');
  return plainText.length > length ? plainText.substring(0, length) + '...' : plainText;
}

async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  const baseDir = path.join(process.cwd(), 'content', 'blog', locale);
  
  if (!fs.existsSync(baseDir)) {
    return [];
  }

  const files = fs.readdirSync(baseDir);
  const posts: BlogPost[] = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(baseDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    const slug = file.replace(/\.md$/, '');
    const category = slug.includes('ccr') ? 'CCR' : 
                    slug.includes('moudjahidines') ? 'Moudjahidines' : 
                    'Particulier';

    posts.push({
      slug,
      title: data.title || slug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      excerpt: data.excerpt || extractExcerpt(content),
      category,
      publishedAt: data.publishedAt || '2024-12-01',
      readingTime: data.readingTime || calculateReadingTime(content),
      author: data.author || 'Import Auto Algérie',
      tags: data.tags || []
    });
  }

  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export default async function BlogIndexPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations('Blog');
  const posts = await getBlogPosts(locale);
  
  const categories = Array.from(new Set(posts.map(post => post.category)));

  return (
    <main className="min-h-screen bg-gray-50">
      <BlogHeaderWrapper />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="container-custom section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-responsive-3xl font-bold mb-6">
              {t('title')}
            </h1>
            <p className="text-responsive-lg opacity-90 mb-8">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-6 py-3 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors">
                {t('all_articles')}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-6 py-3 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.slug} className="group">
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    {/* Category Badge */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          post.category === 'CCR' ? 'bg-blue-100 text-blue-800' :
                          post.category === 'Moudjahidines' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {post.category}
                        </span>
                        <span className="text-sm text-gray-500">{post.readingTime}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                        <Link href={`/${locale}/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{post.author}</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : locale === 'ar' ? 'ar-DZ' : 'zh-CN')}</span>
                      </div>

                      {/* Read More Button */}
                      <Link 
                        href={`/${locale}/blog/${post.slug}`}
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group-hover:translate-x-1 transition-all"
                      >
                        {t('read_more')}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('no_articles')}</h3>
                <p className="text-gray-600">{t('no_articles_desc')}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
} 