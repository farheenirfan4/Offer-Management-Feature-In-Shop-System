<template>
  <div class="pa-4">
    <!-- Heading -->
    

    <!-- Loading / Error Alerts -->
    <v-alert v-if="loading" type="info" variant="tonal" class="mb-3">
      Loading offers...
    </v-alert>
    <v-alert v-if="error" type="error" variant="tonal" class="mb-3">
      {{ error }}
    </v-alert>

    <!-- Header with Add Button -->
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="font-weight-bold mb-4">Offers</h1>
      <v-btn
  color="primary"
  density="compact"
  class="square-btn"
  @click="
    newOffer = {
      title: '',
      description: '',
      price: '',
      discountPercentage: '',
      promotionalTags: '',
      product: '',
      personasId: 0,
      displayConfigureId: '',
      repeatPatterns: 'none',
      repeatDetails: [],
      startDateUTC: '',
      endDateUTC: '',
    };
    editModel = false;
    editingOfferId = null;
    isAddDialogOpen = true;
  "
>
  <v-icon>ri-add-large-fill</v-icon>
</v-btn>
    </div>

    <!-- Offers Table -->
    <v-data-table
      v-if="offers.length"
      :headers="headers"
      :items="offers"
      :items-per-page="5"
      class="elevation-1 custom-header"
      fixed-header
      height="400"
    >

    <template #item.title="{ item }">
  <a href="javascript:void(0)" @click="openUserDialog(item.personasId)">
    {{ item.title }}
  </a>
</template>
      <!-- Custom cell for promotionalTags -->
      <template #item.promotionalTags="{ item }">
        <v-chip-group column>
          <v-chip
            v-for="(tag, index) in item.promotionalTags"
            :key="index"
            size="small"
            color="primary"
            class="ma-1"
          >
            {{ tag }}
          </v-chip>
        </v-chip-group>
      </template>

      <!-- Actions column -->
      <template #item.actions="{ item }">
        <v-btn
          size="small"
          color="black"
          icon="ri-edit-line"
          variant="text"
          @click="editOffer(item)"
        ></v-btn>
        <v-btn
          size="small"
          color="error"
          icon="ri-delete-bin-5-line"
          variant="text"
          @click="deleteOffer(item)"
        ></v-btn>
      </template>

      <template #item.startDateUTC="{ item }">
  <v-chip  size="small">
    {{ new Date(item.startDateUTC).toLocaleString() }}
  </v-chip>
</template>

<template #item.endDateUTC="{ item }">
  <v-chip  size="small">
    {{ new Date(item.endDateUTC).toLocaleString() }}
  </v-chip>
</template>

<!--<template #item.status="{ item }">
    <v-chip
      size="small"
      :color="
        item.status === 'active'
          ? 'success'
          : item.status === 'upcoming'
          ? 'warning'
          : 'error'
      "
      label
    >
      {{ item.status }}
    </v-chip>
  </template>-->
    </v-data-table>

    <!-- Empty State -->
    <v-alert
      v-else-if="!loading"
      type="warning"
      variant="tonal"
      class="mt-3"
    >
      No offers found.
    </v-alert>

    <v-dialog v-model="isAddDialogOpen" max-width="600" persistent>
  <v-card>
    <!-- Title -->
    <v-card-title class="text-h4 font-weight-bold pa-4">
  {{ editModel ? "Edit Offer" : "Add an Offer" }}
</v-card-title>

    <v-card-text>
      <!-- Row 1: Title + Price -->
      <v-row >
        <v-col cols="6">
          <v-text-field label="Title" v-model="newOffer.title" outlined></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field label="Price" type="number" v-model="newOffer.price" outlined></v-text-field>
        </v-col>
      </v-row>

      <!-- Row 2: Description -->
      <v-row >
        <v-col cols="12">
          <v-textarea label="Description" v-model="newOffer.description" outlined ></v-textarea>
        </v-col>
      </v-row>


      <!-- Row 3: Discount + Promotional Tags -->
      <v-row >
        <v-col cols="6">
          <v-text-field label="Discount (%)" type="number" v-model="newOffer.discountPercentage" outlined ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
  label="Promotional Tags (comma-separated)"
  v-model="newOffer.promotionalTags"
  outlined
></v-text-field>
        </v-col>
      </v-row>

      <!-- Row 4: Product -->
      <v-row >
        <v-col cols="12">
          <v-text-field label="Product" v-model="newOffer.product" outlined></v-text-field>
        </v-col>
      </v-row>
      <v-row >
        <v-col cols="6">
          <v-select
            label="Repeat Patterns"
            v-model="newOffer.repeatPatterns"
            :items="['none', 'daily', 'weekly', 'monthly']"
            outlined
          ></v-select>

          
        </v-col>

        <v-col cols="6" v-if="newOffer.repeatPatterns !== 'none'">
    <v-select
      label="Repeat Details"
      v-model="newOffer.repeatDetails"
      :items="repeatDetailsOptions"
      outlined
      multiple
    ></v-select>
    </v-col>
      </v-row>

      <v-row >
        <v-col cols="6">
          <v-text-field label="Personas Id" type="number" v-model="newOffer.personasId" outlined ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field label="Display Configure Id" v-model="newOffer.displayConfigureId" outlined></v-text-field>
        </v-col>
      </v-row>

      <v-row>
  <v-col cols="6">
    <v-text-field
      label="Start Date UTC"
      type="datetime-local"
      v-model="newOffer.startDateUTC"
      outlined
    ></v-text-field>
  </v-col>
  <v-col cols="6">
    <v-text-field
      label="End Date UTC"
      type="datetime-local"
      v-model="newOffer.endDateUTC"
      outlined
    ></v-text-field>
  </v-col>
</v-row>


    </v-card-text>

    <v-divider></v-divider>

    <!-- Actions -->
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="text" @click="isAddDialogOpen = false">Cancel</v-btn>
      <v-btn
  style="background-color: pink"
  color="white"
  class="ma-2 p-4"
  @click="saveOffer"
>
  {{ editModel ? "Update" : "Save" }}
</v-btn>
      
    </v-card-actions>
  </v-card>
</v-dialog>


<v-dialog v-model="isUserDialogOpen" max-width="800">
  <v-card>
    <v-card-title class="text-h5">
      Users for Persona ID: {{ selectedPersonaId }}
    </v-card-title>
    <v-card-text>
      <v-alert v-if="userDialogLoading" type="info" variant="tonal">
        Loading users...
      </v-alert>

      <v-alert v-if="!userDialogLoading && filteredUsers.length === 0" type="warning" variant="tonal">
        No users found for this persona.
      </v-alert>

      <v-data-table
        v-else
        :headers="[
          { title: 'User ID', key: 'id' },
          { title: 'Name', key: 'username' },
          
        ]"
        :items="filteredUsers"
        :items-per-page="5"
        class="elevation-1"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="isUserDialogOpen = false">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from "vue";
import { useOffers } from "../../composables/Offers/useOffer";
import { Offer } from "../../schemas/offerSchema";
import { fetchFilteredUsers, users as filteredUsers } from "../../composables/PlayerData/usePlayerServices"; 
// assuming fetchFilteredUsers is exported from your Persona composable

const isUserDialogOpen = ref(false);
const selectedPersonaId = ref<number | null>(null);
const userDialogLoading = ref(false);

const items = ref([])


const { offers, loading, error, fetchOffers, deleteOffer: removeOffer,addOffer,updateOffer } = useOffers();
const newOffer= ref<Partial<Offer>>({
  id:'',
  title: '',
  description: '',
  price: '',
  discountPercentage: '',
  promotionalTags: '' as unknown as string[] | string,
  product: '',
  personasId : 0,
  displayConfigureId : '',
  repeatPatterns : 'none',
  repeatDetails : [],
  startDateUTC : '',
  endDateUTC : '',
});
const headers = [
  { title: "Title", key: "title" },
  { title: "Description", key: "description" },
  { title: "Price", key: "price" },
  { title: "Discount (%)", key: "discountPercentage" },
  { title: "Tags", key: "promotionalTags" },
  { title: "Product", key: "product" },
  { title: "Persona Id", key: "personasId" },
  { title: "Display Configure Id", key: "displayConfigureId" },
  { title: "Repeat Patterns", key: "repeatPatterns" },
  { title: "RepeatDetails", key: "repeatDetails" },
  { title: "Start Date", key: "startDateUTC" },
  { title: "End Date", key: "endDateUTC" },
  { title: "Is Active", key: "status" },
  { title: "Actions", key: "actions", sortable: false },


];

const isAddDialogOpen = ref(false);
const editModel = ref(false)
const editingOfferId = ref<string | null>(null)

async function openUserDialog(personaId: number) {
  selectedPersonaId.value = personaId;
  isUserDialogOpen.value = true;
  userDialogLoading.value = true;
  
  try {
    await fetchFilteredUsers(personaId); // your function from earlier
  } finally {
    userDialogLoading.value = false;
  }
}





// Delete offer action
async function deleteOffer(item: any) {
  if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
    await removeOffer(item._id || item.id);
    await fetchOffers(); // <-- add this to refresh the list from the backend
  }
}

// ... (other code)

const offersWithStatus = computed(() => {
  return offers.value.map(offer => {
    const now = new Date();
    const startDate = new Date(offer.startDateUTC);
    const endDate = new Date(offer.endDateUTC);

    let status = '';
    if (now < startDate) {
      status = 'upcoming';
    } else if (now > endDate) {
      status = 'expired';
    } else {
      status = 'active';
    }

    return {
      ...offer,
      status // Add the new status property to the offer object
    };
  });
});

const repeatDetailsOptions = computed(() => {
  const pattern = newOffer.value.repeatPatterns;
  if (pattern === 'weekly') {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  }
  if (pattern === 'monthly') {
    return [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
  }
  return [];
});

onMounted(() => {
  fetchOffers();
});


async function saveOffer() {
  try {
    if (newOffer.value.repeatPatterns === 'none') {
      newOffer.value.repeatDetails = []
    }

    const offerToSave = {
      ...newOffer.value,
      createdBy: 'admin',
      updatedBy: 'admin'
    }

    // Convert promotionalTags string to array
    if (typeof offerToSave.promotionalTags === 'string') {
      offerToSave.promotionalTags = offerToSave.promotionalTags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)
    }

    // Convert numbers
    offerToSave.personasId = +(offerToSave.personasId || 0)

    // Convert dates to ISO
    if (offerToSave.startDateUTC) {
      offerToSave.startDateUTC = new Date(offerToSave.startDateUTC).toISOString()
    }
    if (offerToSave.endDateUTC) {
      offerToSave.endDateUTC = new Date(offerToSave.endDateUTC).toISOString()
    }

    // Convert product to JSON string
    if (offerToSave.product) {
      offerToSave.product = JSON.stringify({ name: offerToSave.product })
    } else {
      offerToSave.product = JSON.stringify({})
    }

    if (editModel.value && editingOfferId.value) {
      // 🔹 Create a new object for the update payload
      const dataToUpdate = { ...offerToSave };

      // ❗ Remove the id and status fields from the payload
      delete dataToUpdate.id;
      delete (dataToUpdate as any).status; // Cast to 'any' to avoid TypeScript errors

      await updateOffer(editingOfferId.value, dataToUpdate as Offer);
    } else {
      // 🔹 Add offer
      await addOffer(offerToSave)
    }

    await fetchOffers();

    // Reset form
    isAddDialogOpen.value = false
    editModel.value = false
    editingOfferId.value = null

  } catch (err) {
    console.error("Failed to save offer:", err)
  }
}


function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'green';
    case 'upcoming':
      return 'yellow';
    case 'expired':
      return 'red';
    default:
      return 'grey'; // Default color for unknown status
  }
}

function editOffer(item: Offer & { _id?: string }) {
  newOffer.value = {
    ...item,
    // Convert promotionalTags array back to a comma-separated string for the text field
    promotionalTags: Array.isArray(item.promotionalTags) ? item.promotionalTags.join(", ") : item.promotionalTags || '',
    // Convert the product JSON string back to a simple string
    product: typeof item.product === "string" ? JSON.parse(item.product).name || '' : item.product,
  };
  editingOfferId.value = item._id || item.id || null;
  editModel.value = true;
  isAddDialogOpen.value = true;
}

</script>

<style scoped>
.custom-header th {
  background-color: #1976d2 !important;
  color: white !important;
}

.square-btn {
  min-width: 40px;
  height: 40px;
  border-radius: 20; /* makes it square */
  padding: 12px;
}
</style>
