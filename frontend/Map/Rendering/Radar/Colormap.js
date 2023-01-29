class Colormap {
    constructor(cmpText) {
        this.nodes = []
        this.init(cmpText)
    }

    /**
     * 
     * @param {string} text 
     */
    init(text) {
        const lines = text.split("\n");
        lines.forEach(line => {
            if(line.includes('scale:'))
            {  
                const words = line.trim().split(" ");
                words.shift();
                this.scale = parseFloat(words[0]);
            }

            if(line.includes("color:")) {
                const words = line.trim().split(" ");
                words.shift();
                const value = parseFloat(words[0]);
                words.shift();
                var rgb1 = []
                var rgb2 = []

                if(words.length == 3) {
                    rgb1 = [parseFloat(words[0])/255, parseFloat(words[1])/255, parseFloat(words[2])/255]
                    rgb2 = rgb1
                } else {
                    rgb1 = [parseFloat(words[0])/255, parseFloat(words[1])/255, parseFloat(words[2])/255]
                    rgb2 = [parseFloat(words[3])/255, parseFloat(words[4])/255, parseFloat(words[5])/255]
                }

                this.nodes.push(
                    {
                        val: value,
                        color: rgb1,
                    }
                )
                this.nodes.push(
                    {
                        val: value+0.01,
                        color: rgb2,
                    }
                )
            }
        })
    }

    getColorForValue(val) {
        var correctedValue = val;

        if(this.scale) {
            correctedValue = val * this.scale;
        }

        if(correctedValue <= this.nodes[0].val) {
            return this.nodes[0].color;
        }

        if(correctedValue >= this.nodes[this.nodes.length-1].val) {
            return this.nodes[this.nodes.length-1].color;
        }

        var lowNode = {}
        var highNode = {}

        for(var i = 0; i < this.nodes.length; i++) {
            if(correctedValue <= this.nodes[i].val) {
                lowNode = this.nodes[i-1]
                highNode = this.nodes[i]
                break;
            }
        }
        const normVal = (correctedValue-lowNode.val) / (highNode.val - lowNode.val);

        const resultColor = [
            this.lerp(normVal, lowNode.color[0], highNode.color[0]),
            this.lerp(normVal, lowNode.color[1], highNode.color[1]),
            this.lerp(normVal, lowNode.color[2], highNode.color[2])
        ]
        return resultColor;
    }

    lerp(val, low, max) {
        return low + (max - low) * val
    }
}