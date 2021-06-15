module.exports = {
    findOne: async (a, cond) => {
        let i = 0;
        while (i < a.length) {
            if (await cond(a[i])) {
                return a[i];
            } else {
                i++;
            }
        }
        return null;
    },
}