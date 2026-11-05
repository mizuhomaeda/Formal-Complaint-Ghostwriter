/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type InteractionStage = 'listening' | 'capture' | 'reflect' | 'clarify' | 'draft' | 'revise';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  stage?: InteractionStage;
  summaryOfUnderstanding?: string | null;
  hasDraft?: boolean;
  letterDraft?: string | null;
  unresolvedItems?: string[];
  revisionOptions?: {
    optionA: string;
    optionB: string;
    explanation?: string;
  } | null;
  modelUsed?: string;
}

export interface DraftVersion {
  id: string;
  timestamp: string;
  content: string;
  label: string;
}

export interface JourneyTemplate {
  id: string;
  name: string;
  persona: string;
  description: string;
  initialPrompt: string;
  tagline: string;
}

export interface ErrorNotice {
  id: string;
  message: string;
  failedUserText: string;
}

