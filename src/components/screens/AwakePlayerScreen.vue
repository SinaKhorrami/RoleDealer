<template>
    <section class="reveal-card chooser-card">
        <p class="small-label">Choose next player</p>
        <h4>Select the player to wake</h4>
        <p class="tile-hint">
            {{ players.length }} players remain. Tap a name to start that
            player’s reveal.
        </p>
        <div
            class="tile-grid player-pool-grid"
            role="group"
            aria-label="Choose the next player"
        >
            <div
                v-for="player in players"
                :key="player.id"
                class="tile-card player-pool-tile"
                role="button"
                tabindex="0"
                :aria-label="`Wake ${player.name}`"
                @click="selectPlayer(player.id)"
                @keydown.enter.prevent="selectPlayer(player.id)"
                @keydown.space.prevent="selectPlayer(player.id)"
            >
                <span class="tile-label">{{ player.name }}</span>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "AwakePlayerScreen",
    props: {
        players: {
            type: Array,
            required: true,
        },
    },
    emits: ["choose-player"],
    setup(props, { emit }) {
        const selectPlayer = (playerId) => {
            emit("choose-player", playerId);
        };

        return {
            selectPlayer,
        };
    },
};
</script>

<style scoped>
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

.small-label {
    margin: 0;
    color: #c8aa65;
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

h4 {
    margin: 0;
    font-size: 1rem;
}

.tile-hint {
    margin: 0;
    color: #bdb6aa;
    font-size: 0.9rem;
    line-height: 1.4;
}

.tile-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
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

.player-pool-tile {
    min-height: 24px;
    max-height: 68px;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.tile-label {
    width: 100%;
    font-size: 1rem;
    font-weight: 800;
    color: #aaa;
    word-break: break-word;
    text-align: center;
}

@media (max-width: 620px) {
    .reveal-card {
        padding: 20px;
        min-height: 0;
    }

    .tile-card {
        min-height: 48px;
    }
}
</style>
