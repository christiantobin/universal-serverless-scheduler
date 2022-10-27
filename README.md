# Universal Serverless Scheduling Tool

## Overview

This tool was created to schedule tasks serverlessly using DynamoDB, EventBridge, Lambda, and The Serverless Framework. It is based off the [CDK-Scheduler](https://github.com/guiyom-e/cdk-scheduler) by @guiyom-e, but uses Serverless instead of a CDK application.

## Instructions

- run <code>npm i</code>
- make sure typescript is installed globally
- run <code>npm run create "queue name" </code>
- run <code>serverless package</code> or <code>serverless deploy</code> to use with AWS
