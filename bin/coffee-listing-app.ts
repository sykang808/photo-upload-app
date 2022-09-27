#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib"; // <-- NICE, CDK V2!
import { CoffeeListingAppStack } from "../lib/coffee-listing-app-stack";

const app = new cdk.App();
new CoffeeListingAppStack(app, "CoffeeListingAppStack", {
  stackName: "CoffeeListingAppStack",
});
