const crypto = require('crypto')
const b32 = require('./base32custom')

var TOTP = {}

/**
 *	Function: hex2dec
 * 	Maps 0-F to 0 - 16
 *
 */
function hex2dec(hex) {
	// Ensure hex is a lowercase string
	hex = hex.toString().toLowerCase() 

	if (hex.charCodeAt(0) > 96 && hex.charCodeAt(0) < 103) {
		return hex.charCodeAt(0) - 87
	}
	return hex
}

/**
 *	Function code_time
 *  Returns the time used to generate the code
 *
 */

TOTP.code_time = function() {
	return parseInt( +new Date() / 1000 / 30)
}

/**
 *	Function: generateHexTime
 *  Generate hexadecimal Buffer for code time
 *  @returns: Buffer
 */

function generateHexTime(data) {

	// Fill data until 16 elements
	while(data.length < 16) { data = "0" + data }

	// Split data array each 2 numbers, and return as Buffer
	return new Buffer(data.match(/.{2}/g).map(k => parseInt(k, "16")))
}

function generateNumber (data) {
  const padding = data[data.length - 1] & 0xf

  const A = (data[padding] & 0x7f) << 24
  const B = (data[padding + 1] & 0xff) << 16
  const C = (data[padding + 2] & 0xff) << 8
  const D = (data[padding + 3] & 0xff)
  
  return A | B | C | D
}




function hashMessage(str, key) {
	var hmac = crypto.createHmac("sha1", key);

  hmac.update(str);
	
	return hmac.digest()
}
/**
 *	Function: generate
 *	Generate current code
 */
TOTP.generate = function(key) {
	const currentTime = TOTP.code_time().toString("16")

	// Convert the unix_time / 30 to a Buffer
	var messageTime = generateHexTime(currentTime)

	// Hash the time message
	var hash_hmac = hashMessage(messageTime, key) 

	// Generate the number
	var number = generateNumber(hash_hmac)

	var code = number % 1000000
	code = code.toString()
	while (code.length < 6) { code = "0" + code}
	return code
}


TOTP.check = function(code, key) {
	// Generate the real key
	const realKey = TOTP.generate(key)
	console.log(realKey)
	// Compare each byte
	var valid = 0
	var i = 6
	while (i--) {
		if (code[i] === realKey[i]) {
			valid ++
		}
	}

	return (valid === 6) 
}

TOTP.generateQRUrl = function(label, key) {
	return 'otpauth://totp/' + encodeURIComponent(label) + '?secret=' + b32.encode(key)
}

module.exports = TOTP