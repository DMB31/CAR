import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { notFound } from 'next/navigation';
import LawBox from '@/components/LawBox';
import 'server-only';
import Header from '@/components/Header';

// This function is called at build time to generate the static paths for each blog post.
export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'content', 'blog');
  
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const locales = fs.readdirSync(contentDir);
  
  const paths = locales.flatMap((locale) => {
    const localeDir = path.join(contentDir, locale);
    // Check if localeDir is a directory before reading its contents
    if (fs.existsSync(localeDir) && fs.statSync(localeDir).isDirectory()) {
        const files = fs.readdirSync(localeDir);
        return files.map((filename) => ({
            locale,
            slug: filename.replace('.md', ''),
        }));
    }
    return [];
  });

  return paths;
}


// This is the main component for the blog post page.
export default async function PostPage({ params }: { params: { slug: string, locale: string } }) {
  const { slug, locale } = params;

  // Construct the file path and read the markdown file.
  const filePath = path.join(process.cwd(), 'content', 'blog', locale, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(markdownWithMeta);

  // Convert markdown to HTML.
  const htmlContent = await marked(content);

  const currentPost = {
    ...frontmatter,
    content: htmlContent,
    category: getCategoryFromSlug(slug),
  };
  
    const lawByCategory: Record<string, Record<string, { text: string; sourceUrl: string }>> = {
        fr: {
            CCR: { text: "Le Décret exécutif n° 23-74 du 20 février 2023 régit l'importation de véhicules dans le cadre du CCR, autorisant l'importation de véhicules neufs avec des avantages fiscaux sous conditions strictes de résidence et de cylindrée.", sourceUrl: 'https://www.joradp.dz/FTP/jo-francais/2023/F2023011.pdf' },
            Moudjahidines: { text: "La loi de finances et les circulaires des douanes permettent aux Moudjahidines et ayants droit d'importer un véhicule tous les 5 ans en exonération totale des droits et taxes, pour des cylindrées définies.", sourceUrl: 'https://www.douane.gov.dz/IMG/pdf/circulaire_n_05_du_22_mai_2023.pdf' },
            Particulier: { text: "Le Décret exécutif n° 23-74 autorise les particuliers résidents à importer un véhicule de moins de 3 ans une fois tous les 3 ans, avec des abattements sur les taxes pour les motorisations essence, hybride et électrique.", sourceUrl: 'https://www.joradp.dz/FTP/jo-francais/2023/F2023011.pdf' }
        },
        en: {
            CCR: { text: "Executive Decree No. 23-74 of February 20, 2023 governs the importation of vehicles under the CCR, authorizing the import of new vehicles with tax advantages under strict conditions of residence and engine capacity.", sourceUrl: 'https://www.joradp.dz/FTP/jo-francais/2023/F2023011.pdf' },
            Moudjahidines: { text: "The Finance Act and customs circulars allow Moudjahidines and their dependents to import a vehicle every 5 years with total exemption from duties and taxes, for defined engine capacities.", sourceUrl: 'https://www.douane.gov.dz/IMG/pdf/circulaire_n_05_du_22_mai_2023.pdf' },
            Particulier: { text: "Executive Decree No. 23-74 authorizes resident individuals to import a vehicle less than 3 years old once every 3 years, with tax reductions for gasoline, hybrid, and electric engines.", sourceUrl: 'https://www.joradp.dz/FTP/jo-francais/2023/F2023011.pdf' }
        },
        ar: {
            CCR: { text: "المرسوم التنفيذي رقم 23-74 المؤرخ في 20 فبراير 2023 ينظم استيراد المركبات في إطار شهادة تغيير الإقامة، ويسمح باستيراد مركبات جديدة مع مزايا ضريبية بشروط صارمة تتعلق بالإقامة وسعة المحرك.", sourceUrl: 'https://www.joradp.dz/FTP/jo-arabe/2023/A2023011.pdf' },
            Moudjahidines: { text: "قانون المالية والتعميمات الجمركية يسمحان للمجاهدين وذوي الحقوق باستيراد مركبة كل 5 سنوات مع إعفاء كلي من الحقوق والرسوم، لسعات محرك محددة.", sourceUrl: 'https://www.douane.gov.dz/IMG/pdf/circulaire_n_05_du_22_mai_2023.pdf' },
            Particulier: { text: "المرسوم التنفيذي رقم 23-74 يسمح للأفراد المقيمين باستيراد مركبة أقل من 3 سنوات مرة كل 3 سنوات، مع تخفيضات على الرسوم للمحركات بالبنزين والهجينة والكهربائية.", sourceUrl: 'https://www.joradp.dz/FTP/jo-arabe/2023/A2023011.pdf' }
        },
        zh: {
            CCR: { text: "2023年2月20日第23-74号行政法令规定了CCR框架下的车辆进口，授权在严格的居住和发动机容量条件下进口带税收优惠的新车。", sourceUrl: 'https://www.joradp.dz/FTP/jo-francais/2023/F2023011.pdf' },
            Moudjahidines: { text: "《财政法》和海关通告允许圣战者及其家属每5年进口一辆完全免税的车辆，适用于指定的发动机容量。", sourceUrl: 'https://www.douane.gov.dz/IMG/pdf/circulaire_n_05_du_22_mai_2023.pdf' },
            Particulier: { text: "第23-74号行政法令授权居民每3年进口一辆车龄小于3年的汽车，汽油、混合动力和电动发动机可享受税收减免。", sourceUrl: 'https://www.joradp.dz/FTP/jo-francais/2023/F2023011.pdf' }
        }
    };


  return (
    <div className="bg-gray-50 text-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-12">
            <article className="prose prose-lg max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-md">
                <div className="border-b pb-4 mb-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">{(currentPost as any).title}</h1>
                    <p className="text-gray-500 mt-2">Publié le {new Date((currentPost as any).publishedAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })} par {(currentPost as any).author}</p>
            </div>

                {lawByCategory[locale] && lawByCategory[locale][(currentPost as any).category] && (
                    <LawBox
                        title={`Texte de loi applicable (${(currentPost as any).category})`}
                        text={lawByCategory[locale][(currentPost as any).category].text}
                        sourceUrl={lawByCategory[locale][(currentPost as any).category].sourceUrl}
                    />
                )}
                
                <div dangerouslySetInnerHTML={{ __html: (currentPost as any).content }} />
                    </article>
        </div>
      </div>
  );
}

// Helper function to determine the category from the slug.
function getCategoryFromSlug(slug: string) {
  if (slug.includes('ccr')) return 'CCR';
  if (slug.includes('moudjahidines')) return 'Moudjahidines';
  if (slug.includes('particulier')) return 'Particulier';
  return 'Général';
}

// Function to generate metadata for the page.
export async function generateMetadata({ params }: { params: { slug: string, locale: string } }) {
    const { slug, locale } = params;
    const filePath = path.join(process.cwd(), 'content', 'blog', locale, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return {
            title: "Article non trouvé",
            description: "L'article que vous cherchez n'existe pas.",
        };
    }

    const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter } = matter(markdownWithMeta) as matter.GrayMatterFile<string>;

    return {
        title: (frontmatter as any).title,
        description: (frontmatter as any).excerpt,
        keywords: (frontmatter as any).tags.join(', '),
    };
} 