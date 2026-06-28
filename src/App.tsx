import { Layout } from './components/Layout';
import { KnockoutStage } from './components/KnockoutStage';
import { usePredictionStore } from './store/usePredictionStore';

function App() {
  const bracket = usePredictionStore(s => s.bracket);
  return <Layout><KnockoutStage allMatches={bracket} /></Layout>;
}

export default App;
