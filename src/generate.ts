import { TagData, srcPath, TagNameSpace } from './merge';
import * as fs from 'fs';

const dataPath = srcPath('db.json');

const tagData: TagData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

export interface Tag {
  name: string;
  intro: string | null;
  otherLanguage: string[];
  namespace: TagNameSpace;
}

function load(language: string, fallback: string = 'en-US') {
  const result: Tag[] = [];
  Object.keys(tagData).forEach((namespace: TagNameSpace) => {
    const tags = Object.values(tagData[namespace]);
    tags.forEach(tag => {
      const currentLanguage = tag[language] ? language : fallback;
      const tagInfo = tag[currentLanguage];
      const name = tagInfo.name;
      const intro = tagInfo.intro ?? null;
      const otherLanguage = Object.keys(tag)
        .filter(o => o !== currentLanguage)
        .map(o => tag[o].name);
      result.push({
        name,
        intro,
        otherLanguage,
        namespace,
      });
    });
  });
  fs.writeFileSync(srcPath(`../dist/${language}.json`), JSON.stringify(result, null, 2));
}

load('zh-CN');
load('en-US');
load('zh-TW', 'zh-CN');
