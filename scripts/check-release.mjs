import nextEnv from '@next/env';
import {releaseIssues} from '../src/release-config.mjs';
const {loadEnvConfig}=nextEnv;
loadEnvConfig(process.cwd(),false);
const issues=releaseIssues(process.env);
if(issues.length){console.error('Production release is blocked:');for(const issue of issues)console.error('- '+issue);process.exitCode=1;}
else console.log('Production configuration checks passed. Provider authentication, inbox receipt and domain ownership still require live verification.');
