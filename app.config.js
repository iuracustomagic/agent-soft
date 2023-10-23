module.exports = {
    // use the variable if it's defined, otherwise use the fallback
    icon: process.env.APP_ICON || './assets/icon.png',
    name: process.env.APP_NAME || 'Agent soft',
    expo: {
        extra: {
            eas: {
                projectId: "5365dc34-0210-4cfa-adbe-3f814999d3f9"
            }
        },
        slug: "agent-soft",
        android: {
            "package": "com.iuriradulov.agentsoft"
        }

    }
};
