import util from 'util';
import cspace from '../src/cspace';

const localhost = cspace.instance({
  url: 'http://localhost:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

localhost.read('collectionobjects/0a5f1405-60e2-417b-82fc')
  .then(response => {
    console.log(util.inspect(response, {
      depth: 6,
      colors: true,
    }));
  })
  .catch(error => {
    console.log(util.inspect(error, {
      depth: 6,
      colors: true,
    }));
  });
