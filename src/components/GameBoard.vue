<template>
    <div class="reveal-container">
        <header class="top-bar">
            <div>
                <p class="eyebrow">{{ scenario?.name || "Scenario" }}</p>
                <h1>Role Reveal</h1>
            </div>
            <div class="top-actions">
                <span class="progress"
                    >{{ progressCount }} / {{ assignments.length }}</span
                >
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
            </div>
        </header>

        <main class="reveal-stage">
            <section v-if="!selectedPlayer" class="reveal-card chooser-card">
                <p class="small-label">Choose next player</p>
                <h4>Select the player to wake</h4>
                <p class="tile-hint">
                    {{ unrevealedPlayers.length }} players remain. Tap a name to
                    start that player’s reveal.
                </p>
                <div
                    class="tile-grid player-pool-grid"
                    role="group"
                    aria-label="Choose the next player"
                >
                    <div
                        v-for="player in unrevealedPlayers"
                        :key="player.id"
                        class="tile-card player-pool-tile"
                        role="button"
                        tabindex="0"
                        :aria-label="`Wake ${player.name}`"
                        @click="choosePlayer(player.id)"
                        @keydown.enter.prevent="choosePlayer(player.id)"
                        @keydown.space.prevent="choosePlayer(player.id)"
                    >
                        <span class="tile-label">{{ player.name }}</span>
                    </div>
                </div>
            </section>

            <section
                v-else-if="selectedPlayer && !selectedAssignmentId"
                class="reveal-card chooser-card"
            >
                <p class="small-label">Player selected</p>
                <h3>{{ selectedPlayer.name }}</h3>
                <p class="tile-hint">
                    {{ availableTiles.length }} face-down tiles remain. Let this
                    player tap one tile to reveal their role.
                </p>
                <button
                    type="button"
                    class="secondary-btn"
                    @click="clearPlayerSelection"
                >
                    Change player
                </button>
                <div
                    class="tile-grid player-pool-grid face-down-grid"
                    role="group"
                    aria-label="Choose a face-down tile"
                >
                    <div
                        v-for="(assignment, index) in availableTiles"
                        :key="assignment.id"
                        class="tile-card player-pool-tile face-down-tile"
                        role="button"
                        tabindex="0"
                        :aria-label="`Face-down tile ${index + 1}`"
                        @click="chooseTile(assignment.id)"
                        @keydown.enter.prevent="chooseTile(assignment.id)"
                        @keydown.space.prevent="chooseTile(assignment.id)"
                    >
                        <span class="tile-label">Face down</span>
                        <span class="tile-note">Tap to Reveal</span>
                    </div>
                </div>
            </section>

            <section
                v-else-if="selectedPlayer"
                :class="['reveal-card', 'role-visible', roleCardClass]"
            >
                <p class="small-label">Selected player</p>
                <h2>{{ selectedPlayer.name }}</h2>
                <div class="reveal-role">
                    <span class="role-caption">Role</span>
                    <strong>{{ selectedPlayer.role }}</strong>
                </div>
                <button type="button" class="primary-btn" @click="confirmRole">
                    Got it
                </button>
            </section>

            <section v-else class="reveal-card">
                <p class="small-label">Complete</p>
                <h2>All roles are assigned</h2>
                <button type="button" class="primary-btn" @click="finishReveal">
                    View Summary
                </button>
            </section>
        </main>

        <DrawerMenu
            :open="drawerOpen"
            title="Game Menu"
            eyebrow="Reveal"
            @close="drawerOpen = false"
        >
            <button type="button" class="drawer-action-btn" @click="goBack">
                Back
            </button>
        </DrawerMenu>
    </div>
</template>

<script>
import { computed, ref } from "vue";
import DrawerMenu from "./DrawerMenu.vue";
import { getRoleSide } from "../scenarios.js";
import { saveGameRoles, savePlayers } from "../utils/storage.js";

export default {
    name: "GameBoard",
    components: {
        DrawerMenu,
    },
    props: {
        roles: {
            type: Array,
            required: true,
        },
        scenario: {
            type: Object,
            default: null,
        },
    },
    emits: ["finish"],
    setup(props, { emit }) {
        const assignments = ref(
            props.roles.map((assignment) => ({ ...assignment })),
        );
        const drawerOpen = ref(false);
        const selectedPlayerId = ref(null);
        const selectedAssignmentId = ref(null);
        const unrevealedPlayers = computed(() =>
            assignments.value.filter((assignment) => !assignment.revealed),
        );
        const selectedPlayer = computed(() => {
            return (
                assignments.value.find(
                    (assignment) => assignment.id === selectedPlayerId.value,
                ) || null
            );
        });
        const availableTiles = computed(() => {
            return assignments.value.filter(
                (assignment) => !assignment.revealed,
            );
        });
        const progressCount = computed(() => {
            return (
                assignments.value.filter((assignment) => assignment.revealed)
                    .length + (selectedPlayer.value ? 1 : 0)
            );
        });
        const currentRoleSide = computed(() => {
            return getRoleSide(props.scenario, selectedPlayer.value?.role);
        });
        const roleCardClass = computed(() => {
            return currentRoleSide.value === "Mafia"
                ? "role-mafia"
                : "role-citizen";
        });

        const persist = () => {
            saveGameRoles(assignments.value);
            savePlayers(
                assignments.value.filter((assignment) => assignment.revealed),
            );
        };

        const choosePlayer = (playerId) => {
            selectedPlayerId.value = playerId;
            selectedAssignmentId.value = null;
        };

        const chooseTile = (assignmentId) => {
            selectedAssignmentId.value = assignmentId;
        };

        const confirmRole = () => {
            if (!selectedPlayer.value || !selectedAssignmentId.value) return;

            const assignment = assignments.value.find(
                (entry) => entry.id === selectedPlayerId.value,
            );
            if (!assignment) return;

            assignment.revealed = true;
            selectedPlayerId.value = null;
            selectedAssignmentId.value = null;
            persist();

            if (!unrevealedPlayers.value.length) {
                finishReveal();
            }
        };

        const clearPlayerSelection = () => {
            selectedPlayerId.value = null;
            selectedAssignmentId.value = null;
        };

        const finishReveal = () => {
            emit("finish", assignments.value);
        };

        const goBack = () => {
            if (
                confirm("Go back to setup? Current reveal progress is saved.")
            ) {
                persist();
                window.location.reload();
            }
        };

        return {
            assignments,
            drawerOpen,
            unrevealedPlayers,
            availableTiles,
            selectedPlayerId,
            selectedAssignmentId,
            selectedPlayer,
            progressCount,
            roleCardClass,
            choosePlayer,
            chooseTile,
            clearPlayerSelection,
            confirmRole,
            finishReveal,
            goBack,
        };
    },
};
</script>

<style scoped>
.reveal-container {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    background: #111;
    color: #f8f1e7;
}

.top-bar {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 16px;
    padding: 18px 22px;
    background: #1d1d1d;
    border-bottom: 1px solid #333;
}

.top-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
}

.eyebrow,
.small-label {
    margin: 0;
    color: #c8aa65;
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

h1,
h2,
h3 {
    margin: 0;
}

h1 {
    font-size: 1.25rem;
}

h3 {
    font-size: 0.95rem;
    line-height: 1.25;
}

.progress {
    font-weight: 800;
    color: #c8aa65;
}

.ghost-btn,
.primary-btn {
    border: 0;
    border-radius: 8px;
    font-weight: 800;
    cursor: pointer;
}

.menu-btn {
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 8px;
    background: #252525;
    color: #f8f1e7;
    cursor: pointer;
    display: grid;
    place-items: center;
}

.menu-icon {
    width: 18px;
    display: grid;
    gap: 3px;
}

.menu-icon span {
    display: block;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
}

.ghost-btn {
    background: #2c2c2c;
    color: #f8f1e7;
    padding: 10px 12px;
}

.reveal-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px;
}

.reveal-card {
    width: min(620px, 100%);
    min-height: 340px;
    border: 1px solid #3c3c3c;
    border-radius: 8px;
    background: #1b1b1b;
    padding: 34px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    text-align: center;
}

.chooser-card {
    gap: 18px;
}

.reveal-card h2 {
    max-width: 100%;
    overflow-wrap: anywhere;
    font-size: clamp(2rem, 7vw, 4rem);
    line-height: 1.05;
}

.role-visible {
    border-width: 2px;
}

.tile-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
}

.face-down-grid {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-right: 2px;
}

.player-pool-grid {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-right: 2px;
}

.tile-card {
    border: 1px solid #3c3c3c;
    border-radius: 8px;
    background: linear-gradient(180deg, #242424 0%, #161616 100%);
    color: #f8f1e7;
    padding: 16px 10px;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition:
        transform 0.15s ease,
        border-color 0.15s ease,
        box-shadow 0.15s ease;
}

.tile-card:hover {
    transform: translateY(-2px);
    border-color: #6b6b6b;
}

.tile-card.selected {
    border-color: #c8aa65;
    box-shadow: 0 0 0 2px rgba(200, 170, 101, 0.12);
}

.tile-card.locked {
    opacity: 0.45;
    cursor: not-allowed;
}

.player-tile {
    min-height: 84px;
    align-items: center;
    justify-content: center;
    text-align: left;
}

.player-pool-tile {
    min-height: 24px;
    max-height: 68px;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.face-down-tile {
    align-items: center;
    justify-content: center;
    text-align: center;
}

.face-down-tile .tile-label {
    font-size: 1rem;
}

.face-down-tile .tile-note {
    margin-top: -2px;
}

.tile-label {
    width: 100%;
    font-size: 0.82rem;
    font-weight: 800;
    color: #aaa;
    word-break: break-word;
    text-align: center;
}

.tile-note {
    color: #8f8f8f;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.tile-hint {
    margin: 0;
    color: #bdb6aa;
    font-size: 0.9rem;
    line-height: 1.4;
}

.reveal-role {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.03);
    padding: 18px 16px;
    display: grid;
    gap: 8px;
    text-align: left;
}

.role-caption {
    color: #b7b0a5;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.reveal-role strong {
    overflow-wrap: anywhere;
    font-size: 1.35rem;
    line-height: 1.2;
}

.role-mafia {
    background: #2b1414;
    border-color: #b33a3a;
}

.role-citizen {
    background: #142718;
    border-color: #3d9a55;
}

.role-citizen .small-label {
    color: #95d7a3;
}

.role-citizen .primary-btn {
    background: #2f8f48;
}

.role-mafia .small-label {
    color: #f08f8f;
}

.role-mafia .primary-btn {
    background: #b33a3a;
}

.primary-btn {
    min-height: 52px;
    padding: 0 24px;
    background: #9f2929;
    color: white;
    font-size: 1rem;
}

.secondary-btn {
    border: 1px solid #3c3c3c;
    border-radius: 8px;
    background: #232323;
    color: #f8f1e7;
    min-height: 44px;
    padding: 0 16px;
    font-weight: 800;
    cursor: pointer;
}

.drawer-action-btn {
    border: 0;
    border-radius: 8px;
    background: #252525;
    color: #f8f1e7;
    min-height: 44px;
    padding: 0 16px;
    font-weight: 800;
    cursor: pointer;
    text-align: left;
}

.queue {
    display: none;
}

@media (max-width: 620px) {
    .top-bar {
        grid-template-columns: 1fr auto;
    }

    .eyebrow {
        font-size: 0.68rem;
    }

    h1 {
        font-size: 1rem;
    }

    .reveal-card h2 {
        font-size: 1.55rem;
        line-height: 1.08;
    }

    .reveal-card h3 {
        font-size: 0.82rem;
        line-height: 1.2;
    }

    .tile-label,
    .tile-note,
    .tile-hint,
    .role-caption {
        font-size: 0.76rem;
    }

    .tile-label {
        font-size: 1rem;
    }

    .player-pool-tile {
        padding-left: 10px;
        padding-right: 10px;
        min-height: 48px;
        max-height: 48px;
    }

    .reveal-role strong {
        font-size: 1.08rem;
    }

    .primary-btn,
    .secondary-btn {
        min-height: 40px;
        padding: 0 16px;
        font-size: 0.88rem;
    }

    .ghost-btn {
        min-height: 34px;
        padding: 0 10px;
        font-size: 0.82rem;
        grid-column: 1 / -1;
        justify-self: start;
    }

    .reveal-stage {
        align-items: stretch;
        justify-content: stretch;
        padding: 0;
    }

    .reveal-card {
        width: 100%;
        min-height: 100%;
        border-radius: 0;
        padding: 22px 16px;
    }

    .tile-grid {
        grid-template-columns: 1fr;
    }

    .player-pool-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        max-height: max-content;
        flex: 1;
    }

    .chooser-card {
        justify-content: flex-start;
        gap: 12px;
    }

    .tile-card {
        min-height: 64px;
        justify-content: flex-start;
        padding: 12px 14px;
    }
}
</style>
