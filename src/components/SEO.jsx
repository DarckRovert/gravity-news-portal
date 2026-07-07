import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, url, image, article }) {
  const siteTitle = 'Gravity Portal';
  const defaultDescription = 'Inteligencia descentralizada y detección de anomalías globales. El portal de noticias del Nexo Ágora.';
  const defaultImage = 'https://picsum.photos/seed/gravityportal/1200/630';

  const seo = {
    title: title ? `${title} | ${siteTitle}` : siteTitle,
    description: description || defaultDescription,
    image: image || defaultImage,
    url: url || 'https://gravityportal.test',
  };

  return (
    <Helmet>
      {/* Essential Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      
      {/* Open Graph Tags for Social Media */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Helmet>
  );
}
