/**
 * Create a new object record.
 */

import cspace from '../src';
import log from './helpers/log';

const cs = cspace({
  url: 'https://core.dev.collectionspace.org/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

const config = {
  data: {
    document: {
      '@name': 'collectionobjects',
      'ns2:collectionobjects_common': {
        '@xmlns:ns2': 'http://collectionspace.org/services/collectionobject',
        '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        objectNumber: `TEST.${Date.now()}`,
        comments: {
          comment: `Created by cspace-api.js ${(new Date()).toISOString()}`,
        },
      },
    },
  },
};

cs.create('collectionobjects', config)
  .then((response) => log('response', response))
  .catch((error) => log('error', error));
