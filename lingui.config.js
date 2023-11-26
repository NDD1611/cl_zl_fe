import { formatter } from "@lingui/format-json"
module.exports = {
    locales: ["en", "vi"],
    catalogs: [
        {
            path: "<rootDir>/locales/{locale}/messages",
            include: ["<rootDir>"],
            exclude: ["**/node_modules/**"]
        },
    ],
    format: formatter({ style: "minimal" }),
    sourceLocale: 'en',
    pseudoLocale: 'pseudo'
};