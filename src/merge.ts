import * as fs from 'fs';
import * as path from 'path';

export const enum TagNameSpace {
  /** 女性 */
  female = 'female',
  /** 男性 */
  male = 'male',
  /** 杂项 */
  misc = 'misc',
  /** 艺术家 */
  artist = 'artist',
  /** 团体 */
  group = 'group',
  /** 原作 */
  parody = 'parody',
  /** 角色 */
  character = 'character',
  /** 分类 */
  reclass = 'reclass',
  /** 语言 */
  language = 'language',
}

const TagNameSpaceValues = [
  TagNameSpace.female,
  TagNameSpace.male,
  TagNameSpace.misc,
  TagNameSpace.artist,
  TagNameSpace.group,
  TagNameSpace.parody,
  TagNameSpace.character,
  TagNameSpace.reclass,
  TagNameSpace.language,
];

export interface TagData {
  [namespace: string]: {
    [key: string]: {
      [language: string]: {
        alias?: string[];
        name: string;
        intro?: string;
      };
    };
  };
}

export interface RawData {
  data: {
    namespace: string;
    data: {
      [key: string]: {
        name: string;
        intro: string;
      };
    };
  }[];
}

export const srcPath = (filename: string) => {
  return path.join(__dirname, filename);
};

const dataPath = srcPath('db.json');

let tagData: TagData = {};
TagNameSpaceValues.forEach(namespace => {
  tagData[namespace] = {};
});

if (fs.existsSync(dataPath)) {
  tagData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

const rawDataPath = srcPath('db.raw.json');

const rawData: RawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf-8'));

rawData.data
  .filter(o => o.namespace !== 'rows')
  .forEach(o => {
    const { data, namespace } = o;
    Object.keys(data).forEach(key => {
      const value = tagData[namespace][key] ?? {};
      value['en-US'] = { name: key };
      value['zh-CN'] = { ...value['zh-CN'], name: data[key].name, intro: data[key].intro };
      tagData[namespace][key] = value;
    });
  });

fs.writeFileSync(dataPath, JSON.stringify(tagData, null, 2));
