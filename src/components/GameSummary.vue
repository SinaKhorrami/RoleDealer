<template>
    <div class="summary-container">
        <header class="summary-header">
            <div>
                <p class="eyebrow">{{ scenario?.name || "Scenario" }}</p>
                <h1>Game Summary</h1>
            </div>
            <div class="top-actions">
                <button
                    type="button"
                    class="menu-btn"
                    aria-label="Open menu"
                    @click="drawerOpen = true"
                >
                    <span class="menu-icon" aria-hidden="true">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
                <span class="progress">{{ players.length }} players</span>
            </div>
        </header>

        <main class="summary-content">
            <nav class="tabs" aria-label="Summary sections">
                <button
                    type="button"
                    :class="['tab-btn', { active: activeTab === 'players' }]"
                    @click="activeTab = 'players'"
                >
                    Players
                </button>
                <button
                    type="button"
                    :class="['tab-btn', { active: activeTab === 'notes' }]"
                    @click="activeTab = 'notes'"
                >
                    Game Notes
                </button>
            </nav>

            <section v-if="activeTab === 'players'" class="summary-panel">
                <div class="panel-header">
                    <p class="eyebrow">Assignments</p>
                    <div class="side-summary">
                        <span
                            v-for="side in sideCounts"
                            :key="side.name"
                            :class="['side-pill', side.className]"
                        >
                            {{ side.name }} {{ side.count }}
                        </span>
                    </div>
                </div>

                <nav class="inner-tabs" aria-label="Player sections">
                    <button
                        type="button"
                        :class="[
                            'inner-tab-btn',
                            { active: playerSection === 'active' },
                        ]"
                        @click="playerSection = 'active'"
                    >
                        Active
                    </button>
                    <button
                        type="button"
                        :class="[
                            'inner-tab-btn',
                            { active: playerSection === 'graveyard' },
                        ]"
                        @click="playerSection = 'graveyard'"
                    >
                        Graveyard
                    </button>
                </nav>

                <div v-if="playerSection === 'active'" class="players-list">
                    <div
                        v-for="(player, index) in activePlayers"
                        :key="player.id || `${player.name}-${index}`"
                        :class="[
                            'player-card',
                            player.className,
                            { disabled: player.disabled },
                        ]"
                        @click="openLinkedNight(player)"
                    >
                        <span class="player-index">{{ index + 1 }}</span>
                        <button
                            v-if="editingPlayerId !== player.id"
                            type="button"
                            class="player-name-display"
                            @click.stop="startEditingPlayer(player)"
                        >
                            {{ player.name }}
                        </button>
                        <input
                            v-else
                            v-model="player.name"
                            type="text"
                            class="player-name-input"
                            :data-player-edit-id="player.id"
                            maxlength="30"
                            @click.stop
                            @blur="finishEditingPlayer"
                            @keydown.enter.prevent="finishEditingPlayer"
                            @keydown.escape.prevent="finishEditingPlayer"
                            @input="persistPlayers"
                        />
                        <span class="player-role">{{ player.role }}</span>
                        <label
                            class="status-toggle"
                            @click.stop.prevent="requestToggleChange(player)"
                        >
                            <input
                                :checked="player.disabled"
                                type="checkbox"
                                readonly
                                aria-hidden="true"
                            />
                            <span class="toggle-track" aria-hidden="true">
                                <span class="toggle-thumb"></span>
                            </span>
                        </label>
                        <div
                            v-if="player.disabled"
                            class="disable-controls"
                            @click.stop
                        >
                            <select
                                v-model="player.disabledReason"
                                class="status-select"
                                @change="handleReasonChange(player)"
                            >
                                <option value="voting">Voting</option>
                                <option value="night">Night</option>
                            </select>
                            <select
                                v-if="player.disabledReason === 'night'"
                                v-model.number="player.disabledNight"
                                class="status-select"
                                @change="persistPlayers"
                            >
                                <option
                                    v-for="(_, nightIndex) in nightNotes"
                                    :key="nightIndex"
                                    :value="nightIndex"
                                >
                                    Night {{ nightIndex + 1 }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <div
                    v-else
                    ref="graveyardListRef"
                    class="players-list graveyard-list"
                >
                    <div class="death-summary">
                        <span class="death-pill death-mafia"
                            >Mafia died {{ deadCounts.Mafia }}</span
                        >
                        <span class="death-pill death-citizen"
                            >Citizen died {{ deadCounts.Citizen }}</span
                        >
                        <span class="death-pill death-independent"
                            >Independent died {{ deadCounts.Independent }}</span
                        >
                    </div>
                    <div
                        v-for="(player, index) in graveyardPlayers"
                        :key="player.id || `${player.name}-${index}`"
                        :class="[
                            'player-card',
                            player.className,
                            'graveyard-card',
                            { disabled: player.disabled },
                        ]"
                        :ref="(el) => setPlayerRowRef(player.id, el)"
                        @click="openLinkedNight(player)"
                    >
                        <span class="player-index">{{ index + 1 }}</span>
                        <button
                            v-if="editingPlayerId !== player.id"
                            type="button"
                            class="player-name-display"
                            @click.stop="startEditingPlayer(player)"
                        >
                            {{ player.name }}
                        </button>
                        <input
                            v-else
                            v-model="player.name"
                            type="text"
                            class="player-name-input"
                            :data-player-edit-id="player.id"
                            maxlength="30"
                            @click.stop
                            @blur="finishEditingPlayer"
                            @keydown.enter.prevent="finishEditingPlayer"
                            @keydown.escape.prevent="finishEditingPlayer"
                            @input="persistPlayers"
                        />
                        <span class="player-role">{{ player.role }}</span>
                        <label
                            class="status-toggle"
                            @click.stop.prevent="requestToggleChange(player)"
                        >
                            <input
                                :checked="player.disabled"
                                type="checkbox"
                                readonly
                                aria-hidden="true"
                            />
                            <span class="toggle-track" aria-hidden="true">
                                <span class="toggle-thumb"></span>
                            </span>
                        </label>
                        <div
                            v-if="player.disabled"
                            class="disable-controls"
                            @click.stop
                        >
                            <select
                                v-model="player.disabledReason"
                                class="status-select"
                                @change="handleReasonChange(player)"
                            >
                                <option value="voting">Voting</option>
                                <option value="night">Night</option>
                            </select>
                            <select
                                v-if="player.disabledReason === 'night'"
                                v-model.number="player.disabledNight"
                                class="status-select"
                                @change="persistPlayers"
                            >
                                <option
                                    v-for="(_, nightIndex) in nightNotes"
                                    :key="nightIndex"
                                    :value="nightIndex"
                                >
                                    Night {{ nightIndex + 1 }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            <section v-else class="summary-panel notes-panel">
                <div class="panel-header">
                    <p class="eyebrow">Game notes for</p>
                    <div class="notes-state">Saved locally</div>
                </div>
                <div class="night-tabs" aria-label="Night notes">
                    <button
                        v-for="(_, index) in nightNotes"
                        :key="index"
                        type="button"
                        :class="[
                            'night-tab-btn',
                            {
                                active: activeNightIndex === index,
                                filled: nightNotes[index].trim(),
                            },
                        ]"
                        @click="activeNightIndex = index"
                    >
                        Night {{ index + 1 }}
                    </button>
                </div>
                <label class="night-note-editor">
                    <span>Night {{ activeNightIndex + 1 }}</span>
                    <textarea
                        v-model="nightNotes[activeNightIndex]"
                        @input="handleNotesInput"
                        :placeholder="`Notes for Night ${activeNightIndex + 1}`"
                        class="notes-textarea"
                    ></textarea>
                </label>
            </section>
        </main>

        <DrawerMenu
            :open="drawerOpen"
            title="Game Menu"
            eyebrow="Summary"
            @close="drawerOpen = false"
        >
            <button
                type="button"
                class="drawer-action-btn"
                @click="runDrawerAction(playAgain)"
            >
                Play Again
            </button>
            <button
                type="button"
                class="drawer-action-btn"
                @click="runDrawerAction(goBackToSetup)"
            >
                New Setup
            </button>
        </DrawerMenu>

        <div
            v-if="confirmDialog"
            class="dialog-backdrop"
            role="presentation"
            @click="closeConfirmDialog"
        >
            <section
                class="confirm-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                @click.stop
            >
                <p class="eyebrow">Confirm action</p>
                <h2 id="confirm-title">{{ confirmDialog.title }}</h2>
                <p class="dialog-message">{{ confirmDialog.message }}</p>
                <div class="dialog-actions">
                    <button
                        type="button"
                        class="dialog-secondary-btn"
                        @click="closeConfirmDialog"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="dialog-primary-btn"
                        @click="confirmAction"
                    >
                        {{ confirmDialog.confirmLabel }}
                    </button>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import DrawerMenu from "./DrawerMenu.vue";
import { useGameSummary } from "../composables/useGameSummary.js";

export default {
    name: "GameSummary",
    components: {
        DrawerMenu,
    },
    props: {
        players: {
            type: Array,
            required: true,
        },
        scenario: {
            type: Object,
            default: null,
        },
    },
    emits: ["playAgain", "backToSetup", "updatePlayers"],
    setup(props, { emit }) {
        return useGameSummary(props, emit);
    },
};
</script>

<style src="./GameSummary.css"></style>
