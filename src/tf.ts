import * as tf from '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';

const TOXICITY_LABELS = [
  `toxicity`,
  `severe_toxicity`,
  `identity_attack`,
  `insult`,
  `threat`,
  `sexual_explicit`,
  `obscene`,
];

const setupTensorflow = async (): Promise<
  (comments?: string[]) => Promise<number>
> => {
  await tf.setBackend('cpu');
  const model = await toxicity.load(0.5, TOXICITY_LABELS);

  return async (comments) => {
    const hrstart = process.hrtime();

    console.log('predicting...');

    await Promise.all(
      comments.filter(Boolean).map(async (comment) => {
        const predictions = await model.classify(comment);
        predictions.forEach((i) => {
          i.results.forEach((x) => {
            if (x.match) {
              console.log('omg lol', i.label, comment);
            }
          });
        });
      }),
    );

    const hrend = process.hrtime(hrstart);
    console.info('Execution time (hr): %ds', hrend[0]);

    return 1;
  };
};

export default setupTensorflow;
