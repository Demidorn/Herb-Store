import Header from './Header';
import OfflineIndicator from './OfflineIndicator';
import InstallPrompt from './InstallPrompt';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>{children}</main>
      <OfflineIndicator />
      <InstallPrompt />
    </div>
  );
}