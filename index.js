const fs = require('fs');

module.exports.templateTags = [
  {
    name: 'awscreds',
    displayName: 'Awscreds',
    description: 'Insomnia plugin - AWS credential extractor',
    args: [
      {
        displayName: 'JSON file path',
        type: 'string',
        help: 'Use front slashes for path delimiter. Insomnia has a bug with backward slashes.',
      },
      {
        displayName: 'Attribute',
        type: 'enum',
        options: [
          {
            displayName: 'AWS_ACCESS_KEY_ID',
            value: 'AWS_ACCESS_KEY_ID',
          },
          {
            displayName: 'AWS_SECRET_ACCESS_KEY',
            value: 'AWS_SECRET_ACCESS_KEY',
          },
          {
            displayName: 'AWS_SESSION_TOKEN',
            value: 'AWS_SESSION_TOKEN',
          },
        ],
},
    ],
    run(context, path, attr) {
      // read and parse json
      if (!path || path.length == 0) {
        throw new Error('No file specified');
      }

      let json;
      try {
        const jsonText = fs.readFileSync(path, 'utf8');
        json = JSON.parse(jsonText);
      } catch (e){
        throw new Error("Couldn't parse file: " + path);
      }

      // resolve attribute in json
      const resolveAttr = (attr, json) => {
        switch (attr) {
          case 'AWS_ACCESS_KEY_ID':
            return json.Credentials.AccessKeyId;
          case 'AWS_SECRET_ACCESS_KEY':
            return json.Credentials.SecretAccessKey;
          case 'AWS_SESSION_TOKEN':
            return json.Credentials.SessionToken;
          default:
            return null;
        }
      }

      let attrValue;
      try {
        attrValue = resolveAttr(attr,json);
      } catch(e){
        throw new Error("Couldn't find the attribute " + attr + " in the json file");
      }

      return attrValue;
    },
  },
];