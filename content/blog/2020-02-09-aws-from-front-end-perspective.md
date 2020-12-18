---
title: AWS from a front end engineer's perspective
date: "2020-02-09T12:00:00.000Z"
description: EC2? ELB? IAM? What?
---

EC2? ELB? IAM? What?

Me: Who wants a high level overview of AWS?

No one:

Me: Oh... Well... I'll do my best to explain things from a front end engineer's perspective anyway. :'(

## Background

I've been working on a project to create a template for bootstrapping apps. It's Next.js and TypeScript with some boilerplate code that handles OAuth, connecting with our microservices, all that. We want devs to build apps and not worry about configs or tooling. Easy peasy.

Alas, a front end solution isn't enough, because part of our CI/CD infra is reaching EOL. We don't want to recommend or build on something that'll have to be replaced soon. And devops and infra is just difficult to manage for every non-devops engineer in general, so why not make that easy too?

It took a while, but I eventually got something working that's much easier to set up and more self-service. Now I'm ready to share all I've learned about AWS from the perspective of a front end engineer who initially hated it (and still kind of does).

## Onward to AWS

Here are the tools I've landed on for somewhat easy-to-use, self-serve, production-ready, and secure web apps.

### CodeStar

The template is based on CodeStar.

It's an all-in-one solution by AWS that will provision resources, create a pipeline, create access roles for its service workers, and so on.

An admin needs to allow CodeStar access for the entire account, then you simply need someone to add the CodeStar, CodeBuild, CodeDeploy, CodePipeline access policies to your user role and limit the resources to projects under your team's control, and you're good to go.

### CodeBuild, -Deploy, -Pipeline

CodeBuild handles building from your source (GitHub or CodeCommit). You can specify environment variables through a fairly easy-to-use console.

CodeDeploy handles "deployment groups" (i.e., the environments you want to deploy an app, such as test, staging, and prod).

CodePipeline ties your source control, build, and deploy into one neat pipeline. You can add actions for test, staging, and prod. One stage flows into the next until everything's done.

### Parameter Store

Parameter Store is for storing configuration or secrets in one place. You can specify who has access to a secret through tags, and only those resources are able to retrieve and decrypt the secret.

For example, you add a client secret, and tag it with key = `awscodestar:projectArn` and value = `arn:aws:codestar:region:account:project/your-project`. This means only your CodeStar project can use it during the build step.

In CodeBuild, you can specify an environment variable `client_secret`, and the value is `/the/path/to/the/client_secret`. The next time you rebuild, the CodeStar worker will be able to get and decrypt that parameter, assuming you've added the right access controls (see the IAM section below).

### CloudFormation

CodeStar automatically creates a template.yml. In the template, you describe resources you want like "a small server," "route my traffic to a pretty URL," "these're my certifates," "only let these IPs access my app," etc.

CloudFormation takes that template, compares it with your previous template, and it creates, updates, or deletes the resources you've added, changed, or removed.

It's declarative, like React. However, you have to be careful and delibrate when updating the template, or you can confuse CloudFormation, which will require your devops team or AWS support to fix it for you.

My rule of them here has been to take things slow and never change the template or retry failed changes until a rollback has completed.

### VPC - Virtual Private Cloud

I'll be honest: I don't really know how this works. To my knowledge, you have a VPC that sections off your part of the Amazon cloud. So you physically share AWS resources with other companies, but they're logically separated.

Then there are subnets that specify IP ranges that can access to your resources. For example, you can have a private subnet that only allows internal traffic on your company's network/VPN, in addition to a public subnet for external-facing sites.

These can be further limited by security groups, so only resources internal to your section of the cloud can access it.

This is the part I know the least about AWS. I'm glad our devops team figured all this out, and I just get to use it.

### Route 53

DNS names and forwarding!

Here you can define something like `*.company.com` and `*.internalonly.com`. When someone sets up a record like `accounts.internalonly.com`, it will only forward traffic from internal IPs.

### EC2 - Elastic Cloud Compute

You rent servers (instances) from Amazon and pay per hour of use.

You can limit access through the VPC, subnets, and security groups. As far as I can tell, you can't even access an EC2 instance with a public IP if it's on a private subnet. Still, I'd set a security group to be sure.

### ELB - Elastic Load Balancing

So you have an EC2 instance or many, and they have really hard to remember IPs like `10.0.150.1` or `10.0.160.1`? Setting up an Application Load Balancer (ALB) will handle traffic and pass it to the correct instance. This is helpful if you have instances in multiple geographic locations, and you want to make sure users connect to the fastest one for them.

You have a listener on the ALB for traffic on port 443 with an SSL certificate, for example. You define a target group as the EC2 instance's port 80 (where your app is running).

Finally, you need to define a Route 53 record set that describes your hosted zone (e.g., `internalonly.com` or `company.com`) and the actual name you want like `accounts.internalonly.com`.

When someone hits `https://accounts.internalonly.com`,
1. Route 53 sees a matching set
1. It forwards traffic to the ALB
1. ALB sees you're hitting port 443 (HTTPS) that it's listening for
1. It forwards that to the best EC2 instance it can (the target group)
1. EC2 instance handles it, and returns the response back up the chain

### IAM - Identity and Access Management

How do you allow/deny access to certain things? That's IAM. It keeps track of roles and policies.

A role can be something like job role "senior-developer" or "junior-developer," or it can be team-based like "team-edward" or "team-jacob."

Policies describe four things:

1. `Action` - what you can do (e.g., run an EC2 instance, create a traffic forwarding rule)
1. `Resource` - what you can use (e.g., only allow internal subnets or hosted zones to be used)
1. `Effect` - whether you're allowed or denied access to the above
1. `Condition` - pattern matching conditional (e.g., you can only run micro or small EC2 instances)

In this way, you can make sure only admins can wholesale delete resources and let something like CodeStar manage resources it has created. Devs should generally describe what they want in a CloudFormation template and let AWS take care of the rest.

For example, here's a reusable policy to limit what subnets CodeStar can run an EC2 instance on:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": [
        "arn:aws:ec2:*:*:subnet/subnet-SUBNET_ID_01",
        "arn:aws:ec2:*:*:subnet/subnet-SUBNET_ID_02",
        "arn:aws:ec2:*:*:subnet/subnet-SUBNET_ID_03",
        "arn:aws:ec2:*:*:subnet/subnet-SUBNET_ID_04",
        "arn:aws:ec2:*:*:network-interface/*",
        "arn:aws:ec2:*:*:instance/*",
        "arn:aws:ec2:*:*:volume/*",
        "arn:aws:ec2:*::image/ami-*",
        "arn:aws:ec2:*:*:key-pair/*",
        "arn:aws:ec2:*:*:security-group/*"
      ]
    }
  ],
  "Condition": {
    "StringEquals": {
      "ec2:InstanceType": [
        "t2.nano",
        "t2.micro",
        "t2.small"
      ]
    }
  }
}
```

This prevents someone from creating a CodeStar template that is hosted on an internet-facing EC2 instance that anyone can access by default. It also prevents them from using expensive instances. AWS doesn't allow limiting the number of resources that can be created by a template, but fingers crossed that's coming soon.

Then there's this template that will prevent someone from forwarding traffic from an internal instance an external ALB.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "route53:GetChange",
        "route53:GetHostedZone",
        "route53:ListHostedZones",
        "route53:ListHostedZonesByName",
        "route53:ListResourceRecordSets",
        "route53:GetHostedZoneCount",
        "route53domains:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "route53:ChangeResourceRecordSets",
        "route53:ListResourceRecordSets",
        "apigateway:GET"
      ],
      "Resource": [
        "arn:aws:route53:::hostedzone/HOSTED_ZONE_ID",
        "arn:aws:apigateway:*::/domainnames"
      ]
    }
  ]
}
```

By adding these policies and `ElasticLoadBalancingFullAccess` to `CodeStarWorker-MY_APP-CloudFormation`, you'll be able to create internal-only EC2 instances and ALBs via CodeStar. No one but rogue admins would be able to allow access otherwise.

Finally, you can add the following policy to `CodeStarWorker-MY_APP-ToolChain` to allow CodeBuild to get and decrypt Parameter Store values:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameters",
        "ssm:GetParameter"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "sss:resourceTag/awscodestar/projectArn": "arn:aws:codestar:region:account:project/my-app"
        }
      }
    }
  ]
}
```

## Final thoughts

AWS is super complicated, but I'm glad they're taking steps to create more complete solutions like CodeStar that abstracts a lot of the complicated stuff away.

Sure, it's not a completely foolproof solution, but it's a good starting point for people like me who had no idea how to get started otherwise. By using CodeStar as a base, I'm able to explore solutions that make sense in context instead of having all of AWS thrown at me.

I hope you all found my explanations of AWS tools and concepts helpful and not _too_ inaccurate. 
