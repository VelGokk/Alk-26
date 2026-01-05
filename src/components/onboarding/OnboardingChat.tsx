"use client";

import { useMemo, useState } from "react";
import type { AppDictionary } from "@/config/i18n";
import {
  getLearningProfile,
  LEARNING_PROFILE_IDS,
  type LearningProfileId,
} from "@/config/learning-profile";
import {
  LEARNING_PATH_DEFINITIONS,
  LEARNING_PATH_IDS,
  type LearningPathId,
} from "@/config/learning-paths";

export type OnboardingSessionState = {
  step: number;
  learningProfile?: LearningProfileId | null;
  learningPath?: LearningPathId | null;
  isComplete: boolean;
  answers?: Record<string, string>;
};

type OnboardingAction = "profile" | "path";

type OnboardingChatProps = {
  dictionary: AppDictionary;
  initialState: OnboardingSessionState;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const API_ENDPOINT = "/api/onboarding/session";

function formatCompletionText(
  dictionary: AppDictionary,
  profile: LearningProfileId,
  path: LearningPathId
) {
  const profileLabel = dictionary.learningProfile[
    getLearningProfile(profile).labelKey
  ];
  const pathLabel = dictionary.dashboard[
    LEARNING_PATH_DEFINITIONS[path].labelKey
  ];
  const template = dictionary.dashboard.onboardingCompleteMessage;
  if (!template) {
    return `${profileLabel} · ${pathLabel}`;
  }
  return template
    .replace("{profile}", profileLabel)
    .replace("{path}", pathLabel);
}

function buildMessages(
  state: OnboardingSessionState,
  dictionary: AppDictionary
): ChatMessage[] {
  const profileDef =
    state.learningProfile && getLearningProfile(state.learningProfile);
  const pathDef =
    state.learningPath && LEARNING_PATH_DEFINITIONS[state.learningPath];
  const shouldAskPath =
    state.step >= 2 && Boolean(state.learningProfile || profileDef);

  const messages: ChatMessage[] = [
    {
      id: "greeting",
      role: "assistant",
      text: dictionary.dashboard.onboardingGreeting,
    },
  ];

  messages.push({
    id: "profile-prompt",
    role: "assistant",
    text: dictionary.dashboard.onboardingProfilePrompt,
  });

  if (profileDef) {
    messages.push({
      id: "profile-response",
      role: "user",
      text: dictionary.learningProfile[profileDef.labelKey],
    });
  }

  if (shouldAskPath) {
    messages.push({
      id: "path-prompt",
      role: "assistant",
      text: dictionary.dashboard.onboardingPathPrompt,
    });
    if (pathDef) {
      messages.push({
        id: "path-response",
        role: "user",
        text: dictionary.dashboard[pathDef.labelKey],
      });
    }
  }

  if (
    state.isComplete &&
    profileDef &&
    pathDef &&
    dictionary.dashboard.onboardingCompleteMessage
  ) {
    messages.push({
      id: "completion",
      role: "assistant",
      text: formatCompletionText(
        dictionary,
        state.learningProfile as LearningProfileId,
        state.learningPath as LearningPathId
      ),
    });
  }

  return messages;
}

export function OnboardingChat({ dictionary, initialState }: OnboardingChatProps) {
  const [sessionState, setSessionState] = useState(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messages = useMemo(
    () => buildMessages(sessionState, dictionary),
    [sessionState, dictionary]
  );

  const profileOptions = LEARNING_PROFILE_IDS.map((id) => {
    const definition = getLearningProfile(id);
    return {
      id,
      label: dictionary.learningProfile[definition.labelKey],
    };
  });

  const pathOptions = LEARNING_PATH_IDS.map((id) => {
    const definition = LEARNING_PATH_DEFINITIONS[id];
    return {
      id,
      label: dictionary.dashboard[definition.labelKey],
      description: dictionary.dashboard[definition.descriptionKey],
    };
  });

  const showProfileOptions = !sessionState.learningProfile;
  const showPathOptions =
    Boolean(sessionState.learningProfile) &&
    !sessionState.learningPath &&
    sessionState.step >= 2;

  const handleChoice = async (action: OnboardingAction, value: string) => {
    if (isSaving) return;
    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, value }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(
          payload?.error ??
            dictionary.dashboard.onboardingError ??
            "Unable to save. Try again."
        );
        return;
      }

      const nextState: OnboardingSessionState = {
        step: payload.onboarding?.step ?? sessionState.step,
        learningProfile:
          payload.onboarding?.learningProfile ?? sessionState.learningProfile,
        learningPath:
          payload.onboarding?.learningPath ?? sessionState.learningPath,
        isComplete: Boolean(payload.onboarding?.isComplete),
        answers: payload.onboarding?.answers ?? sessionState.answers,
      };

      setSessionState(nextState);
    } catch {
      setError(
        dictionary.dashboard.onboardingError ??
          "Unable to reach the server. Try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const completionReady =
    sessionState.isComplete &&
    Boolean(sessionState.learningProfile && sessionState.learningPath);

  return (
    <div className="space-y-6">
      <div className="space-y-4" aria-live="polite">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <p
              className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                message.role === "assistant"
                  ? "bg-zinc-100 text-zinc-900"
                  : "bg-ink text-white"
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}
      </div>

      {!!error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {showProfileOptions && (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {profileOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-left text-sm font-semibold text-ink transition hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => handleChoice("profile", option.id)}
                disabled={isSaving}
              >
                {option.label}
              </button>
            ))}
          </div>
          {isSaving && (
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              {dictionary.dashboard.onboardingSaving ?? "Saving..."}
            </p>
          )}
        </div>
      )}

      {showPathOptions && (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {pathOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-left text-sm transition hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => handleChoice("path", option.id)}
                disabled={isSaving}
              >
                <p className="font-semibold text-ink">{option.label}</p>
                <p className="mt-1 text-xs text-zinc-500">{option.description}</p>
              </button>
            ))}
          </div>
          {isSaving && (
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              {dictionary.dashboard.onboardingSaving ?? "Saving..."}
            </p>
          )}
        </div>
      )}

      {completionReady && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-semibold text-ink">
            {dictionary.dashboard.onboardingCompleteTitle}
          </p>
          <p className="mt-2">
            {formatCompletionText(
              dictionary,
              sessionState.learningProfile as LearningProfileId,
              sessionState.learningPath as LearningPathId
            )}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-zinc-500">
            {dictionary.dashboard.onboardingCompleteHint}
          </p>
        </div>
      )}
    </div>
  );
}
