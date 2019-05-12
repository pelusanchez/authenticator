// Algorithm from http://www.herongyang.com/Encoding/Base32-Encoding-Algorithm.html
module.exports = {
    encode: function (string) {
        const table = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        function paddingZeros(a) {
            a = a.toString()
            while (a.length < 8) { a = "0" + a }
            return a
        }
        // Divide in blocks of 5 bytes
        var excess = ""
        var result = ""
        
        for (var i = 0, j = string.length; i < j; i++) {

            // 
            var binData = excess + paddingZeros(string.charCodeAt(i).toString("2"))

            // Divide in blocks of 5 bytes
            var binDataSplitted = binData.match(/.{1,5}/g)

            // If last block is less than 5, store it in excess and will be prepend
            if (binDataSplitted[binDataSplitted.length - 1].length < 5) {
                excess = binDataSplitted.splice(-1)[0]
            } else {
                excess = ""
            }

            // Transform to base32 table
            binDataSplitted.forEach(quintet => {
                result += table[parseInt(quintet, 2)]
            })

        }

        if (excess.length > 0) {
            while (excess.length < 5) { excess += "0"}
            result += table[parseInt(excess, 2)]
        }
        
        // Fill until block of 8 | NO PADDING IN THIS IMPLEMENTATION
//        while (result.length % 8 !== 0) {
//            result += "="
//        }

        return result
    }

}