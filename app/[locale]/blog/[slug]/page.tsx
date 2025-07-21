import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';

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

// Helper to get all articles for navigation
function getArticles(locale: string): BlogPost[] {
  const baseDir = path.join(process.cwd(), 'app', '[locale]', 'blog', '[slug]', locale);
  
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

  return posts;
}

export default async function BlogArticlePage({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params;
  const t = await getTranslations('Blog');
  const articlePath = path.join(process.cwd(), 'app', '[locale]', 'blog', '[slug]', locale, `${slug}.md`);
  
  let content = '';
  let frontmatter: any = {};
  
  try {
    const file = fs.readFileSync(articlePath, 'utf-8');
    const parsed = matter(file);
    content = marked(parsed.content);
    frontmatter = parsed.data;
  } catch (e) {
    return notFound();
  }

  // Get current post metadata
  const currentPost: BlogPost = {
    slug,
    title: frontmatter.title || slug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    excerpt: frontmatter.excerpt || extractExcerpt(content),
    category: slug.includes('ccr') ? 'CCR' : slug.includes('moudjahidines') ? 'Moudjahidines' : 'Particulier',
    publishedAt: frontmatter.publishedAt || '2024-12-01',
    readingTime: frontmatter.readingTime || calculateReadingTime(content),
    author: frontmatter.author || 'Import Auto Algérie',
    tags: frontmatter.tags || []
  };

  // For navigation and related posts
  const allPosts = getArticles(locale);
  const relatedPosts = allPosts
    .filter(post => post.slug !== slug && post.category === currentPost.category)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center space-x-2 text-sm">
                         <Link href={`/${locale}`} className="text-gray-500 hover:text-primary-600">
               {locale === 'fr' ? 'Accueil' : locale === 'ar' ? 'الرئيسية' : '首页'}
             </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/${locale}/blog`} className="text-gray-500 hover:text-primary-600">
              {t('title')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{currentPost.category}</span>
          </div>
        </div>
      </nav>

      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            {/* Category Badge */}
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                currentPost.category === 'CCR' ? 'bg-blue-100 text-blue-800' :
                currentPost.category === 'Moudjahidines' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {currentPost.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {currentPost.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{currentPost.author}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(currentPost.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : locale === 'ar' ? 'ar-DZ' : 'zh-CN')}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{currentPost.readingTime}</span>
              </div>
            </div>

            {/* Excerpt */}
            {currentPost.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {currentPost.excerpt}
              </p>
            )}
          </header>

          {/* Article Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <article 
              className="prose prose-lg prose-gray max-w-none p-8 md:p-12 
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:space-y-2 prose-ol:space-y-2
                prose-li:text-gray-700
                prose-blockquote:border-l-primary-500 prose-blockquote:bg-gray-50 prose-blockquote:p-4
                prose-table:border-collapse prose-table:border-gray-200
                prose-th:bg-gray-50 prose-th:border prose-th:border-gray-200 prose-th:p-3
                prose-td:border prose-td:border-gray-200 prose-td:p-3"
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          </div>

          {/* Tags */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="mt-8">
                             <h3 className="text-lg font-semibold text-gray-900 mb-4">
                 {locale === 'fr' ? 'Tags' : locale === 'ar' ? 'الكلمات المفتاحية' : '标签'}
               </h3>
              <div className="flex flex-wrap gap-2">
                {currentPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-8"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('back_to_blog')}
            </Link>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                                 <h3 className="text-2xl font-bold text-gray-900 mb-8">{t('related_articles')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((post) => (
                    <article key={post.slug} className="group">
                      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                        <div className="p-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                            post.category === 'CCR' ? 'bg-blue-100 text-blue-800' :
                            post.category === 'Moudjahidines' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {post.category}
                          </span>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                            <Link href={`/${locale}/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h4>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{post.readingTime}</span>
                            <span>{new Date(post.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : locale === 'ar' ? 'ar-DZ' : 'zh-CN')}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 