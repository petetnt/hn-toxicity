import 'isomorphic-unfetch';
import '@tensorflow/tfjs-node';
import { getCommentsForId } from './firebase-utils';
import setupTensorflow from './tf';

const TEST_ID = '24300036'; // 	Zoom still don't understand GDPR

(async () => {
  const comments = await getCommentsForId(TEST_ID);
  const classifier = await setupTensorflow();

  classifier(comments);
})();

export default {};
