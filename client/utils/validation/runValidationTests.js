const assert = require('assert');
const { mapFormToNftInfo, buildIpInfoFromNft } = require('../validation');

function run() {
  console.log('Running validation tests...');

  // Happy path
  const form = { title: 'My NFT', description: 'An example', image: 'https://example.com/image.png' };
  const nft = mapFormToNftInfo(form);
  assert.strictEqual(nft.name, 'My NFT');
  assert.strictEqual(nft.description, 'An example');
  assert.strictEqual(nft.image_url, 'https://example.com/image.png');

  const ip = buildIpInfoFromNft(nft, '0xabc');
  assert.strictEqual(ip.title, 'My NFT');
  assert.strictEqual(ip.description, 'An example');
  assert.strictEqual(ip.creators, '0xabc');
  assert.ok(new Date(ip.createdat).toString() !== 'Invalid Date');

  // Missing name
  let threw = false;
  try {
    mapFormToNftInfo({ title: '', description: 'd', image: 'i' });
  } catch (e) {
    threw = true;
    assert.strictEqual(e.message, 'NFT name is required');
  }
  assert.ok(threw, 'Expected missing name to throw');

  // Missing image
  threw = false;
  try {
    mapFormToNftInfo({ title: 'a', description: 'd' });
  } catch (e) {
    threw = true;
    assert.strictEqual(e.message, 'NFT image is required');
  }
  assert.ok(threw, 'Expected missing image to throw');

  console.log('All validation tests passed ✅');
}

run();
