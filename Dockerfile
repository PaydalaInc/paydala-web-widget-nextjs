# Get NPM packages
FROM node:16-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
ARG NPM_TOKEN  
COPY .npmrc.docker .npmrc  
COPY package.json package-lock.json ./
RUN npm ci --only=production
RUN rm -f .npmrc

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

ARG user=nextjs
ARG group=nodejs
ARG usergroup=${user}:${group}
RUN adduser -u 1001 -S ${user}
RUN addgroup -g 1001 -S ${group}

COPY --from=builder /app/public ./public
COPY --from=builder --chown=${usergroup} /app/.next/standalone ./
COPY --from=builder --chown=${usergroup} /app/.next/static ./.next/static

USER ${user}

EXPOSE 3000
