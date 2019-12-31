const Theme = require('../models/theme.model');

module.exports = {
    findAll: async (request, response, next) => {
        const themes = await Theme.find()
            .then(theme => theme)
            .catch(error => error);
        response.status(200).json(themes);
    },
    findByUserId: async (request, response, next) => {
        console.log(request.user._id);
        const theme = await Theme.findOne({user_id: request.user._id})
            .then(theme => theme)
            .catch(error => error);
        response.status(200).json(theme.theme);
    },
    add: async (request, response, next) => {
        const {
            user_id,
            theme
        } = request.body;

        const userExists = await Theme.findOne({'user_id': user_id})
            .then(theme => theme)
            .catch(error => error);
        
        const newTheme = new Theme({
            user_id,
            theme
        });

        if (!userExists) {
            await newTheme.save();
        } else {
            //await userExists.update($set: {'theme': theme});
            await Theme.update({'user_id': user_id}, {$set: {'theme': theme}});
        }
        
        response.status(200).json({'theme': newTheme.theme});
    }
}