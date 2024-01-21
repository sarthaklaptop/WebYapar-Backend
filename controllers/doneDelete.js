const File=require("../models/File");





exports.markAsDone = async (req, res) => {
    try {
        console.log("inside try block");
        const { itemId } = req.params;
        console.log("itemId", itemId);

        // Check if the item exists
        const existingItem = await File.findById(itemId);
        if (!existingItem) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        const updatedItem = await File.findByIdAndUpdate(itemId, { status: 'done' }, { new: true });
        console.log("updatedItem", updatedItem);
        
        return res.json({ success: true, data: updatedItem });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
  
exports.markAsDeleted = async (req, res) => {
    try {
        const { itemId } = req.params;
        console.log("itemId", itemId);

        // Check if the item exists
        const existingItem = await File.findById(itemId);
        if (!existingItem) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        // Continue with the update
        const updatedItem = await File.findByIdAndUpdate(itemId, { status: 'deleted' }, { new: true });
        console.log("updatedItem", updatedItem);

        return res.json({ success: true, data: updatedItem });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
