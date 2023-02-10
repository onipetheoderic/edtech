import '../styles/style.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../lib/apollo';

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="layout">
        <Component {...pageProps} />
      </div>
    </ApolloProvider>
  );
}

export default MyApp;
