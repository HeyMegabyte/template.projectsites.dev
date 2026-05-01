import Header from './Header';
import Footer from './Footer';
import { Lightbox } from './Lightbox';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <Lightbox />
    </>
  );
}
