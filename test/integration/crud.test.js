import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cspace from '../../src/cspace';

chai.use(chaiAsPromised);
chai.should();

const config = {
  url: 'http://localhost:8180/cspace-services',
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
};

describe(`run against ${config.url}`, () => {
  const localhost = cspace.instance(config);
  const objectNumber = `TEST.${Date.now()}`;
  const comment = `Created by cspace-api.js ${(new Date()).toISOString()}`;

  let objectCsid = null;

  it('can create an object record', () => {
    const promise = localhost.create('collectionobjects',
      {
        content: {
          document: {
            '@name': 'collectionobjects',
            'ns2:collectionobjects_common': {
              '@xmlns:ns2': 'http://collectionspace.org/services/collectionobject',
              '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
              objectNumber,
              comments: {
                comment,
              },
            },
          },
        },
      });

    return promise.should.eventually
      .include({ status: 201 })
      .and.have.deep.property('headers.location').that.is.ok
      .then(location => {
        objectCsid = location.substring(location.lastIndexOf('/') + 1);
      });
  });

  it('can find the record', () => {
    const promise = localhost.read('collectionobjects',
      {
        params: {
          pgSz: 5,
          pgNum: 0,
          as: `collectionobjects_common:objectNumber ILIKE "%${objectNumber}%"`,
          wf_deleted: false,
        },
      });

    return promise.should.eventually
      .include({ status: 200 })
      .and.have.property('data')
        .with.property('ns2:abstract-common-list')
          .with.property('list-item')
            .with.property('csid', objectCsid);
  });

  it('can read the record', () => {
    const promise = localhost.read(`collectionobjects/${objectCsid}`);

    return promise.should.eventually
      .include({ status: 200 })
      .and.have.property('data')
        .with.property('document')
          .with.property('ns2:collectionobjects_common')
            .that.includes({ objectNumber })
            .and.has.property('comments')
              .with.property('comment', comment);
  });

  it('can update the record', () => {
    const commentUpdate = `Updated at ${Date.now()}`;

    const promise = localhost.update(`collectionobjects/${objectCsid}`,
      {
        content: {
          document: {
            '@name': 'collectionobjects',
            'ns2:collectionobjects_common': {
              '@xmlns:ns2': 'http://collectionspace.org/services/collectionobject',
              '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
              comments: {
                comment: commentUpdate,
              },
            },
          },
        },
      });

    return promise.should.eventually
      .include({ status: 200 })
      .and.have.property('data')
        .with.property('document')
          .with.property('ns2:collectionobjects_common')
            .that.includes({ objectNumber })
            .and.has.property('comments')
              .with.property('comment', commentUpdate);
  });

  it('can delete the record', () => {
    const promise = localhost.delete(`collectionobjects/${objectCsid}`);

    return promise.should.eventually
      .include({ status: 200 });
  });
});
