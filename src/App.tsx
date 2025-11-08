import './App.css';
import { SettingsPanel } from './components/SettingsPanel';
import { DocumentsPanel } from './components/DocumentsPanel';
import { TestChat } from './components/TestChat';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <TestChat />
      <hr style={{ margin: '40px 0' }} />
      <SettingsPanel />
      <hr style={{ margin: '40px 0' }} />
      <DocumentsPanel />
    </div>
  );
}

export default App;
