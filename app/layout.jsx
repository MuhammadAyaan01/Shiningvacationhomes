import {Footer} from '../components/footer.jsx';
import '../src/style.css';
import '../src/motion.css';
import '../src/experience.css';
import '../src/chapter.css';
import '../src/header.css';
import '../src/focus.css';
import '../src/enquiry.css';
import {SiteProvider,Header,Motion} from '../components/site';
import localFont from 'next/font/local';
import {siteUrl,organizationSchema} from '../src/seo.js';

const instrument=localFont({src:'../public/fonts/instrument-sans-latin.woff2',weight:'400 700',display:'swap',variable:'--font-instrument'});
const inter=localFont({src:'../public/fonts/inter-latin.woff2',weight:'400 700',display:'swap',variable:'--font-inter'});
export const metadata={metadataBase:siteUrl,title:{default:'Shining Vacation Homes | Dubai',template:'%s | Shining Vacation Homes'},robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large'}}};
export const viewport={themeColor:'#F7F5F0'};
export default function RootLayout({children}){
 return <html lang="en" data-motion="full" className={`${instrument.variable} ${inter.variable}`}><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationSchema).replace(/</g,'\\u003c')}}/><SiteProvider><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main" tabIndex={-1}>{children}</main><Footer/><Motion/></SiteProvider></body></html>;
}
