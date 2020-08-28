import striptags from 'striptags';
import * as firebase from 'firebase';
import appConfig from './config';

type Item = {
  kids: string[];
  text?: string;
};
const app = firebase.initializeApp(
  { databaseURL: appConfig.FIREBASE_DATABASE_URL },
  appConfig.FIREBASE_DATABASE_URL,
);
const db = app.database();

export const getCommentsForId = async (
  id: string,
  allComments: string[] = [],
): Promise<string[]> => {
  const itemRef = db.ref('v0/item').child(id);
  const snap = await itemRef.once('value');
  const item: Item = snap.val();

  if (!item.kids || item.kids.length === 0) {
    return [...allComments, striptags(item.text)];
  }

  const { kids } = item;

  const children = await Promise.all(kids.map((i) => getCommentsForId(i)));
  const flat = children.flat();

  return [...allComments, striptags(item.text), ...flat];
};

export default {};
