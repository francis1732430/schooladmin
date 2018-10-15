import conf from './config';
const braintree = require('braintree');

const BraintreeConnection = braintree.connect({
    environment: braintree.Environment[conf.braintree.environment],
    merchantId: conf.braintree.merchantId,
    publicKey: conf.braintree.publicKey,
    privateKey: conf.braintree.privateKey
});

export default BraintreeConnection;
