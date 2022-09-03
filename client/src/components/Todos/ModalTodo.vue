<template>
	<q-dialog v-model="showModal" persistent>
		<q-card style="width: 700px; max-width: 80vw">
			<q-bar class="bg-teal text-white">
				<div>{{ timer.date }} - {{ timer.time }}</div>

				<q-space />

				<q-btn
					flat
					dnse
					round
					icon="highlight_off"
					@click="handleClickForModal(false)"
				/>
			</q-bar>
			<q-card-section>
				<div class="text-h6">Create A Todo</div>
			</q-card-section>
			<q-card-section class="q-pa-md q-col-gutter-sm">
				<div class="row q-col-gutter-sm">
					<div class="col-12 col-sm-6">
						<q-input
							outlined
							color="teal"
							v-model="todos.title"
							label="Title"
							dense
						/>
					</div>
					<div class="col-12 col-sm-6">
						<q-input
							outlined
							color="teal"
							v-model="dueDateTime"
							label="Due Date / Due Time"
							dense
						>
							<template v-slot:prepend>
								<q-icon name="event" class="cursor-pointer">
									<q-popup-proxy
										cover
										transition-show="scale"
										transition-hide="scale"
									>
										<q-date mask="YYYY-MM-DD HH:mm" v-model="dueDateTime">
											<div class="row items-center justify-end">
												<q-btn
													v-close-popup
													label="Close"
													color="primary"
													flat
												/>
											</div>
										</q-date>
									</q-popup-proxy>
								</q-icon>
							</template>
							<template v-slot:append>
								<q-icon name="access_time" class="cursor-pointer">
									<q-popup-proxy
										cover
										transition-show="scale"
										transition-hide="scale"
									>
										<q-time
											mask="YYYY-MM-DD HH:mm"
											v-model="dueDateTime"
											format24h
										>
											<div class="row items-center justify-end">
												<q-btn
													v-close-popup
													label="Close"
													color="primary"
													flat
												/>
											</div>
										</q-time>
									</q-popup-proxy>
								</q-icon>
							</template>
						</q-input>
					</div>
				</div>
				<div class="row q-col-gutter-xs">
					<div class="col-12">
						<q-input
							outlined
							v-model="todos.description"
							color="teal"
							label="Description"
							type="textarea"
						/>
					</div>
				</div>
			</q-card-section>
			<q-card-actions align="right" class="q-pa-md q-col-gutter-sm">
				<q-btn color="teal" icon="task_alt" label="save" @click="create" />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script>
import { onMounted, onUnmounted, reactive, toRefs, ref, computed } from "vue";
import { useStore } from "vuex";
import moment from "moment";
export default {
	/**
	 * 
	 ==================================================================*/
	name: "ModalTodo",
	props: ["todo", "timer"],
	defineEmits: ["update"],

	/**
	 * 
	 ==================================================================*/
	setup(props, { emit }) {
		const store = useStore();

		/**
	   * 
	   ==================================================================*/
		const showModal = computed(() => store.getters["todos/modal"]);

		function clearRecord(obj) {
			for (const key in obj) {
				delete obj[key];
			}

			let n = reactive({
				title: "",
				description: "",
				dueDate: "",
				dueTime: "",
			});

			Object.assign(obj, n);
		}

		function handleClickForModal(val) {
			store.dispatch("todos/showModal", val);
			clearRecord(todos);
		}

		/**
	   * CREATE TODO
	   ==================================================================*/
		let todos = reactive(props.todo);
		function create() {
			const dueDate = dueDateTime.value.split(" ")[0];
			const dueTime = dueDateTime.value.split(" ")[1];
			todos.dueDate = dueDate;
			todos.dueTime = dueTime;
			emit("update", todos);
			clearRecord(todos);
		}

		let dueDateTime = ref("");
		onMounted(() => {
			dueDateTime.value =
				moment().format("YYYY-MM-DD") + " " + moment().format("HH:mm");
		});

		return {
			todos,
			showModal,
			dueDateTime,
			handleClickForModal,
			create,
		};
	},
};
</script>
