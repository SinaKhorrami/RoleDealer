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
            </div>
        </header>

        <main class="reveal-stage">
            <AwakePlayerScreen
                v-if="!selectedPlayer"
                :players="unrevealedPlayers"
                @choose-player="choosePlayer"
            />

            <CardRevealScreen
                v-else-if="selectedPlayer && !selectedAssignmentId"
                :selected-player="selectedPlayer"
                :available-tiles="availableTiles"
                :selected-assignment-id="selectedAssignmentId"
                @change-player="clearPlayerSelection"
                @choose-tile="chooseTile"
            />

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
    </div>
</template>

<script>
import AwakePlayerScreen from "./screens/AwakePlayerScreen.vue";
import CardRevealScreen from "./screens/CardRevealScreen.vue";
import { useGameBoard } from "../composables/useGameBoard.js";

export default {
    name: "GameBoard",
    components: {
        AwakePlayerScreen,
        CardRevealScreen,
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
        return useGameBoard(props, emit);
    },
};
</script>

<style src="./GameBoard.css"></style>
